// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { MongooseUser, User } from '../../../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { UsersDatabaseRepository } from '../database.repository';

@Injectable()
export class MongooseMongodbUsersDatabaseRepository
  implements UsersDatabaseRepository
{
  constructor(
    @InjectModel(MongooseUser.name)
    private readonly userModel: Model<MongooseUser>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(
        USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }

    const mongooseUser = await this.userModel.create({
      email,
    });

    const applicationUser = new User({ email: mongooseUser.email });
    return applicationUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const mongooseUser = await this.userModel.findOne({
      email: email,
    });

    if (!mongooseUser) {
      return null;
    }

    const applicationUser = new User({
      email: mongooseUser.email,
      id: mongooseUser.id,
    });
    return applicationUser;
  }

  async findAll() {
    const mongooseUsers = await this.userModel.find();
    const applicationUsers = mongooseUsers.map(
      (user) => new User({ email: user.email, id: user.id })
    );
    return applicationUsers;
  }
}
