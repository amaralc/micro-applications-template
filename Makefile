storage-setup:
	cd apps/storage && docker-compose up -d

hasura-console:
	cd apps/storage && cp .env.development.local ./hasura/.env.development.local && cd hasura && hasura console --envfile .env.development.local

hasura-setup:
	cd apps/storage && cp .env.development.local ./hasura/.env.development.local \
	&& cd hasura \
	&& hasura metadata apply --envfile .env.development.local \
	&& hasura migrate apply --envfile .env.development.local \
	&& hasura metadata reload --envfile .env.development.local

storage-cleanup:
	cd apps/storage && docker-compose down

docker-prune:
	make storage-cleanup \
	&& docker volume prune \
	&& docker system prune
