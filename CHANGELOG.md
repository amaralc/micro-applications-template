# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.2](https://github.com/amaralc/where-is-my-stuff/compare/v0.0.1...v0.0.2) (2023-02-24)


### Features

* add mongo to persistence layer ([ff6af9c](https://github.com/amaralc/where-is-my-stuff/commit/ff6af9cf120c2095226c009de11c601ba3d81638))
* add mongodb to env and make ([5fa840d](https://github.com/amaralc/where-is-my-stuff/commit/5fa840df012cd69f0ee2b3c9f89e11c20a8fbbfc))
* implement mongoose database repository ([765e356](https://github.com/amaralc/where-is-my-stuff/commit/765e3563d4efc09826f33ab2194dc67bcaeffd3d))
* use mongoose models and schema ([822964f](https://github.com/amaralc/where-is-my-stuff/commit/822964fae7d358d62bf3f0ab2b5f1eec16f43b65))

### 0.0.1 (2023-02-21)


### Features

* add and organize tests ([66abb72](https://github.com/amaralc/where-is-my-stuff/commit/66abb721952bc136c942f1aca88a827129b5fe35))
* add config file ([c5ac521](https://github.com/amaralc/where-is-my-stuff/commit/c5ac521647103342d18ad03a5f0ef6066c3283e0))
* add findByEmail and return conflict exception if necessary ([3d40ee1](https://github.com/amaralc/where-is-my-stuff/commit/3d40ee1f3c373e68bda3d06722ee4629dfd50232))
* add global app http exception ([1fc0b50](https://github.com/amaralc/where-is-my-stuff/commit/1fc0b50dfdb499878c3fd97b5c2e0cec027d6f93))
* add in memory events manager ([d2f8622](https://github.com/amaralc/where-is-my-stuff/commit/d2f86220a404e9a3409c3e4728810bf7ae6498e3))
* add kafka as in memory implementation and start configuratio ([f3ad1bf](https://github.com/amaralc/where-is-my-stuff/commit/f3ad1bf5462b5871e1b0ea94485ca2d4c73a4a4a))
* add kafka docker-compose ([a7528ee](https://github.com/amaralc/where-is-my-stuff/commit/a7528ee7481e371eafa40e0eb13a0eb120be9761))
* add object validation with class transformer ([3906ea3](https://github.com/amaralc/where-is-my-stuff/commit/3906ea326d38e790e55ef67348553348a84c3233))
* add persistence to plan subscription ([1910c4a](https://github.com/amaralc/where-is-my-stuff/commit/1910c4ab2ae5c9ea177e44f78ea68a04f85dc20f))
* add plan subscription to db schema ([9380361](https://github.com/amaralc/where-is-my-stuff/commit/9380361878f7e8492b4b1fa339fb46bc71a37067))
* add plan subscriptions table to prisma schema ([0cdba46](https://github.com/amaralc/where-is-my-stuff/commit/0cdba46055400fa83af57bbcac0b0c7653f0e15d))
* add script to initialize consumer ([47a3b0f](https://github.com/amaralc/where-is-my-stuff/commit/47a3b0fe5671e43f21ea87483d64b4aa842a09b0))
* add standard-version ([71cad43](https://github.com/amaralc/where-is-my-stuff/commit/71cad43437d6d6409f48a6fea596aee9bed11306))
* add tests ([514b123](https://github.com/amaralc/where-is-my-stuff/commit/514b12395441371e8d0c96f7d8706af890a6c8b0))
* add users table to hasura metadata ([2266206](https://github.com/amaralc/where-is-my-stuff/commit/22662065e1e4d71d19f695b2b8c669c757094c03))
* bootstrap auth service ([0c0a690](https://github.com/amaralc/where-is-my-stuff/commit/0c0a690c2bbc51e35843b4c80f2bc28ed17593b2))
* bootstrap consumer ([ffb4ba2](https://github.com/amaralc/where-is-my-stuff/commit/ffb4ba2b79958bd7e00ba64fe48e8c86bbad4abc))
* change message payload ([5122a43](https://github.com/amaralc/where-is-my-stuff/commit/5122a43af006e7e70b267306b1f13997b6c29c75))
* create storage and events repositories ([ebf605f](https://github.com/amaralc/where-is-my-stuff/commit/ebf605f3d9232ef43a79c5913e92a194110d01a2))
* create users migratio ([baf0e14](https://github.com/amaralc/where-is-my-stuff/commit/baf0e1477e4a25041e94738996c4dd835b7032ef))
* enhance tests ([3171d3b](https://github.com/amaralc/where-is-my-stuff/commit/3171d3b7b9ffe51678485213c0829b16ebaf2e48))
* evolve unit tests ([b30ccc1](https://github.com/amaralc/where-is-my-stuff/commit/b30ccc110389057409150a18ff360cdcf66fb299))
* in memory pubsub ([3929750](https://github.com/amaralc/where-is-my-stuff/commit/3929750b5e54920126d8166da1a3efb868c3c289))
* move consumer initialization to consumer file ([8a76e88](https://github.com/amaralc/where-is-my-stuff/commit/8a76e88bf65cd75850744f7903fb0d99a21bfac1))
* pull schema from db, add generate scripts and references ([7b5f962](https://github.com/amaralc/where-is-my-stuff/commit/7b5f962265ccc0a74f1d72c583f6bc3a69446fb7))
* refine event repository implementation ([a8b32ce](https://github.com/amaralc/where-is-my-stuff/commit/a8b32ce3a8922c2469a608a60f53822eb057f4e0))
* use kafka implementation ([8be9c0d](https://github.com/amaralc/where-is-my-stuff/commit/8be9c0d4c7b9e4374a11eab8be1434c3ae38069e))
* use mongo or postgresql ([aadf75c](https://github.com/amaralc/where-is-my-stuff/commit/aadf75c1a93fd4cb67dbfdc665fdc63b540ca9ab))


### Bug Fixes

* adjust conflict message ([ebfd253](https://github.com/amaralc/where-is-my-stuff/commit/ebfd2530c1de43d7fc053a3c6bcc7bc5c60f85e3))
* adjust env file ([130c64f](https://github.com/amaralc/where-is-my-stuff/commit/130c64f406f84b5a6c79b0890cfc3459189c1f67))
* adjust env setup ([6a28705](https://github.com/amaralc/where-is-my-stuff/commit/6a287057cc87b2f943b76008819fd604f43b4b5a))
* adjust in memory events repository ([802ce51](https://github.com/amaralc/where-is-my-stuff/commit/802ce51a33a32d729f7a7560b530620279b74df8))
* adjust kafka implementation ([fb9214e](https://github.com/amaralc/where-is-my-stuff/commit/fb9214eed497c9201e03ea1af7e9058bdccc260c))
* adjust prisma user repository create implementation ([fdb725f](https://github.com/amaralc/where-is-my-stuff/commit/fdb725fcf80ac552aa3280fc8be7766b3890ccc2))
* use default prisma client ([7ab4522](https://github.com/amaralc/where-is-my-stuff/commit/7ab4522e30b4a98c15550b353bd1ed86a2558341))
