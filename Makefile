# Persistence
persistence-setup-postgresql:
	cp .env.example .env \
	&& cp .env.example ./apps/_persistence/.env \
	&& cd apps/_persistence && docker-compose -f docker-compose-postgresql.yml up -d && echo 'Finish setting up containers...' && sleep 2

persistence-cleanup-postgresql:
	cd apps/_persistence && docker-compose -f docker-compose-postgresql.yml down

persistence-prune-postgresql:
	cd apps/_persistence && docker-compose -f docker-compose-postgresql.yml down -v

persistence-setup-mongodb:
	cp .env.example .env \
	&& cp .env.example ./apps/_persistence/.env \
	&& cd apps/_persistence && docker-compose -f docker-compose-mongodb.yml up -d && echo 'Finish setting up containers...' && sleep 2

persistence-cleanup-mongodb:
	cd apps/_persistence && docker-compose -f docker-compose-mongodb.yml down

persistence-prune-mongodb:
	cd apps/_persistence && docker-compose -f docker-compose-mongodb.yml down -v

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

sudo-docker-image-build:
# sudo docker build -t micro-applications-template:latest --build-arg SSH_PEM_PRIVATE_KEY="$$(cat ~/.ssh/id_rsa)" --no-cache .
	sudo docker build -t micro-applications-template:latest --build-arg SSH_PEM_PRIVATE_KEY="$$(cat ~/.ssh/id_rsa)" --no-cache .

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

service-rest-api-serve:
	# The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve service-rest-api

consumer-with-api-serve:
	# The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve consumer-with-api

service-consumer-serve:
	# The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve service-consumer
