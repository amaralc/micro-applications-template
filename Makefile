persistence-setup:
	cd apps/persistence && docker-compose up -d

hasura-console:
	cd apps/persistence && cp .env.development.local ./hasura/.env.development.local && cd hasura && hasura console --envfile .env.development.local

hasura-setup:
	cd apps/persistence && cp .env.development.local ./hasura/.env.development.local \
	&& cd hasura \
	&& hasura metadata apply --envfile .env.development.local \
	&& hasura migrate apply --envfile .env.development.local \
	&& hasura metadata reload --envfile .env.development.local

persistence-cleanup:
	cd apps/persistence && docker-compose down

docker-prune:
	make persistence-cleanup \
	&& docker volume prune \
	&& docker system prune
