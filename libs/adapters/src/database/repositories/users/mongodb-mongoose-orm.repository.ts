// users.repository.ts
import { USERS_ERROR_MESSAGES } from '@core/domains/users/constants/error-messages';
import { UserEntity } from '@core/domains/users/entities/user/entity';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { CreateUserDto } from '@core/domains/users/services/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseUser } from './mongodb-mongoose-orm.entity';

@Injectable()
export class MongoDbMongooseOrmUsersDatabaseRepository implements UsersDatabaseRepository {
  constructor(
    @InjectModel(MongooseUser.name)
    private readonly userModel: Model<MongooseUser>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(USERS_ERROR_MESSAGES['CONFLICTING_EMAIL']);
    }

    const mongooseUser = await this.userModel.create({
      email,
    });

    const applicationUser = new UserEntity({ email: mongooseUser.email });
    return applicationUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const mongooseUser = await this.userModel.findOne({
      email: email,
    });

    if (!mongooseUser) {
      return null;
    }

    const applicationUser = new UserEntity({
      email: mongooseUser.email,
      id: mongooseUser.id,
    });
    return applicationUser;
  }

  async findAll() {
    const mongooseUsers = await this.userModel.find();
    const applicationUsers = mongooseUsers.map((user) => new UserEntity({ email: user.email, id: user.id }));
    return applicationUsers;
  }
}
