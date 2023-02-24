# Persistence
persistence-setup:
	cp .env.example .env \
	&& cp .env.example ./apps/_persistence/.env \
	&& cd apps/_persistence && docker-compose up -d && echo 'Finish setting up containers...' && sleep 2

persistence-cleanup:
	cd apps/_persistence && docker-compose down

# Hasura (Dev Tool)
hasura-console:
	cd apps/_persistence && cp .env ./hasura/.env && cd hasura && hasura console --envfile .env

hasura-setup:
	echo 'Setting up Hasura...' \
	&& cd apps/_persistence && cp .env ./hasura/.env \
	&& cd hasura \
	&& hasura metadata apply --envfile .env \
	&& hasura migrate apply --envfile .env \
	&& hasura metadata reload --envfile .env

# Infra
infra-setup:
	make persistence-setup && make hasura-setup

# Docker
docker-prune:
	make persistence-cleanup \
	&& docker volume prune \
	&& docker system prune

docker-config:
	cp .env.example ./apps/_persistence/.env \
	&& cd apps/_persistence && docker-compose config

# Application
auth-prisma-postgresql-setup:
	yarn prisma generate --schema prisma/postgresql.schema.prisma

auth-api-only-serve:
  # The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve auth-api-only

auth-consumer-with-api-serve:
  # The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve auth-consumer-with-api

auth-consumer-only-serve:
  # The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve auth-consumer-only
