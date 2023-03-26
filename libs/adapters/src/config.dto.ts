import { PLAN_SUBSCRIPTIONS_TOPICS } from '@core/domains/plan-subscriptions/constants/topics';
import { USERS_TOPICS } from '@core/domains/users/constants/topics';
import { Logger } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { IDatabaseProvider } from './database/types';
import { KafkaCustomTransport } from './events/infra/kafka-custom.transport';
import { IEventsProvider, ITransporter } from './events/types';

class ConfigDto {
  // Events
  nestJsMicroservicesOptions?: NestApplicationContextOptions & MicroserviceOptions;
  eventsConsumerPort = 3001; // Specify process to avoid conflicts with rest-api port (nestjs default port is 3000)
  eventsProvider = (process.env['EVENTS_PROVIDER'] as IEventsProvider) || 'kafka';
  eventsTransporter = (process.env['EVENTS_TRANSPORTER'] as ITransporter) || 'dyna-kafka-js';
  kafkaBroker = process.env['KAFKA_BROKER'] || 'localhost:9092';
  kafkaClientId = process.env['KAFKA_CLIENT_ID'] || 'nestjs-service-template-client-id';
  kafkaGroupId = process.env['KAFKA_CONSUMER_GROUP_ID'] || 'nestjs-service-template-group-id';
  kafkaTransactionalId = process.env['KAFKA_TRANSACTIONAL_ID'] || randomUUID();
  kafkaUsername = process.env['KAFKA_SASL_USERNAME'];
  kafkaPassword = process.env['KAFKA_SASL_PASSWORD'];
  kafkaUseSasl = this.kafkaUsername !== '' && this.kafkaPassword !== '';
  kafkaTopicUserCreated = USERS_TOPICS['USER_CREATED'];
  kafkaTopicPlanSubscriptionCreated = PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'];

  // Database
  databaseProvider = (process.env['DATABASE_PROVIDER'] as IDatabaseProvider) || 'in-memory';
  mongoDbDatabaseUrl =
    process.env['MONGODB_DATABASE_URL'] ||
    'mongodb://root:example@localhost:27017/auth?ssl=false&connectTimeoutMS=5000&maxPoolSize=100&authSource=admin';
  postgresHost = process.env['POSTGRES_HOST'] || 'localhost';
  postgresPort = process.env['POSTGRES_PORT'] ? Number(process.env['POSTGRES_PORT']) : 5432;
  postgresUsername = process.env['POSTGRES_USER'] as string;
  postgresPassword = process.env['POSTGRES_PASSWORD'] as string;
  postgresDatabase = process.env['POSTGRES_DB'] as string;

  // Application
  applicationNodeEnv = process.env['NODE_ENV'] || 'development';
  applicationPort = process.env['PORT'] || 3000;

  // Initialization
  constructor() {
    // Set default transport
    this.nestJsMicroservicesOptions = {
      transport: Transport.TCP,
      options: {
        port: this.eventsConsumerPort, // Configuration for local development in host machine (avoid conflicts with rest-api port)
      },
    };

    if (this.eventsProvider === 'kafka') {
      switch (this.eventsTransporter) {
        case 'nestjs-default-kafka-transporter':
          // Default NestJs Kafka transport
          Logger.log('Using default kafka transporter', ConfigDto.name);
          this.nestJsMicroservicesOptions = {
            transport: Transport.KAFKA,
            options: {
              client: { brokers: [this.kafkaBroker], clientId: this.kafkaClientId },
              consumer: { groupId: this.kafkaGroupId },
            },
          };
          break;

        case 'nestjs-custom-kafka-transporter':
          // Custom nestjs dyna-kafka-js transporter
          Logger.log('Using dynamox kafka transporter', ConfigDto.name);
          this.nestJsMicroservicesOptions = {
            strategy: new KafkaCustomTransport({
              client: { clientId: this.kafkaClientId, brokers: [this.kafkaBroker] },
              consumer: { groupId: this.kafkaGroupId },
            }),
          };
          break;

        case 'simple-kafka-transporter':
          Logger.log('Usage with TCP transport in specific machine process', ConfigDto.name);
          break;

        default:
          Logger.log('Usage with no specific transport configuration', ConfigDto.name);
          break;
      }
    }
  }
}

export const configDto = new ConfigDto();
