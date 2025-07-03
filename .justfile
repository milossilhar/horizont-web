# expressions and variables
DOCKER_PROD_FILE := './docker/compose.prod.yaml'

# generates Angular client from openapi yaml
generate-openapi:
    rm -rf src/app/rest/api src/app/rest/model src/app/rest/*.ts
    npm run generate-openapi

# starts frontend stack as production configuration in local Docker
start:
    docker compose -f {{DOCKER_PROD_FILE}} up -d --build

# stops frontend stack
stop:
    docker compose -f {{DOCKER_PROD_FILE}} down -v
