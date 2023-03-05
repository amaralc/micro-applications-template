import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://root:example@localhost:27017/auth?ssl=false&connectTimeoutMS=5000&maxPoolSize=100&authSource=admin'
    ),
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
