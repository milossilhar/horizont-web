#!/usr/bin/env bash
export DOCKER_SCAN_SUGGEST=false

DOCKER_IMAGE_NAME="horizon/caddy-web"
DOCKERFILE=./docker/Dockerfile
DOCKER_COMPOSE_COMMAND="docker compose -f ./docker/compose.prod.yaml"
DOCKER_COMPOSE_STOP_TIMEOUT=10

NEED_BUILD=false
NEED_START=false

MAIN_BRANCH_NAME=master

ARG_ONE="$1"
ARG_TWO="$2"

set -e;

log() {
  echo "$(date +%FT%TZ) :: $1"
}

has_option() {
  if [ "$ARG_ONE" == "$1" ] || [ "$ARG_TWO" == "$1" ] ||
     [ "$ARG_ONE" == "$2" ] || [ "$ARG_TWO" == "$2" ] ; then
    echo "true"
  else
    echo "false"
  fi
}

log "Starting Continuous Delivery and Integration"

# goto root (horizon-system) directory
pushd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )/.." > /dev/null

CICD_TAG=$(cat $DOCKERFILE | grep -oP 'cicd="\K[a-z\-]+' | tail -1)
if [ -z "$CICD_TAG" ] ; then
  log "\nNo cicd LABEL found in Dockerfile.\n\n"
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "$MAIN_BRANCH_NAME" ] ; then
  printf "\nNot on branch named '$MAIN_BRANCH_NAME'. Aborting.\n\n"
  exit 1
fi

log "FETCHING LATEST CHANGES"
git fetch origin $MAIN_BRANCH_NAME -q

if [ $(has_option "--force" "-f") == "true" ] ; then
  NEED_PULL=true
else
  head_hash=$(git rev-parse HEAD)
  upstream_hash=$(git rev-parse $MAIN_BRANCH_NAME@{upstream})

  log "head_hash: $head_hash"
  log "upstream_hash: $upstream_hash"

  if [ "$head_hash" != "$upstream_hash" ] ; then
    NEED_PULL=true
  else
    NEED_PULL=
  fi
fi

if [ -n "$NEED_PULL" ] ; then
  log "PULLING LATEST SOURCE CODE"
  git reset --hard
  git pull
  git log --pretty=oneline -1
  NEED_BUILD=true
elif [ -z "$(docker images -a | grep "$DOCKER_IMAGE_NAME" || true)" ] ; then
  NEED_BUILD=true
fi

status=$($DOCKER_COMPOSE_COMMAND ps --filter status=running -q)
if [ "$NEED_BUILD" == true ] ; then
  if [ ! -z "$status" ] ; then
    log "STOPPING RUNNING CONTAINER"
    $DOCKER_COMPOSE_COMMAND stop -t $DOCKER_COMPOSE_STOP_TIMEOUT
  fi
  NEED_START=true
elif [ -z "$status" ] ; then
  NEED_START=true
fi

if [ "$NEED_START" == false ] ; then
  log "No changes found. Container is already running."
elif [ "$NEED_BUILD" == true ]; then
  log "BUILDING & STARTING CONTAINER"
  $DOCKER_COMPOSE_COMMAND up -d --build
else
  log "STARTING CONTAINER"
  $DOCKER_COMPOSE_COMMAND up -d
fi

if [ $(has_option "--cleanup" "-cu") == "true" ] ; then
  log "Docker Image CLEAN UP"
  docker image prune --force --filter "label=cicd=$CICD_TAG"
fi

log "Continuous Delivery and Integration FINISHED"
