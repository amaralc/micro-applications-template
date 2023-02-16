# Persistence
persistence-setup:
	cp .env.example ./apps/persistence/.env \
	&& cd apps/persistence && docker-compose up -d && echo 'Finish setting up containers...' && sleep 2

persistence-cleanup:
	cd apps/persistence && docker-compose down

# Docker
docker-prune:
	make persistence-cleanup \
	&& docker volume prune \
	&& docker system prune

# Hasura (Dev Tool)
hasura-console:
	cd apps/persistence && cp .env ./hasura/.env && cd hasura && hasura console --envfile .env

hasura-setup:
	echo 'Setting up Hasura...' \
	&& cd apps/persistence && cp .env ./hasura/.env \
	&& cd hasura \
	&& hasura metadata apply --envfile .env \
	&& hasura migrate apply --envfile .env \
	&& hasura metadata reload --envfile .env

# Application
auth-prisma-postgresql-setup:
	prisma generate --schema apps/auth/prisma/schema.prisma

auth-serve:
  # The .env in root folder make it possible to use env variables within .env file
	cp .env.example .env && make auth-prisma-postgresql-setup && nx serve auth
