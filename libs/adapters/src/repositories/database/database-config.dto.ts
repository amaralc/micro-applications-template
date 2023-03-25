import { databaseConfig } from '@infra/config';
import { IDatabaseProvider } from '@infra/database/types';

export class DatabaseConfigDto {
  provider: IDatabaseProvider;

  constructor() {
    this.provider = databaseConfig.databaseProvider;
  }
}
