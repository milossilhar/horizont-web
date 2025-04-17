# expressions and variables
DOCKER_PROD_FILE := './docker/compose.prod.yaml'

# starts frontend stack as production configuration in local Docker
start:
    docker compose -f {{DOCKER_PROD_FILE}} up -d --build

# stops frontend stack
stop:
    docker compose -f {{DOCKER_PROD_FILE}} down -v