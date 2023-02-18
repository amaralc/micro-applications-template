import { UsersModule } from '@auth/shared/domains/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
