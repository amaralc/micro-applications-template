import { ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { UserEntity } from '../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../errors/error-messages';
import { UsersDatabaseRepository } from '../repositories/database.repository';
import { UsersEventsRepository } from '../repositories/events.repository';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class CreateUserService {
  constructor(
    private usersDatabaseRepository: UsersDatabaseRepository,
    private usersEventsRepository: UsersEventsRepository
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<{ user: UserEntity }> {
    // Validate or reject
    const createUserDtoInstance = plainToInstance(CreateUserDto, createUserDto);

    try {
      await validateOrReject(createUserDtoInstance);
    } catch (errors) {
      if (Array.isArray(errors) && errors.every((error) => error instanceof ValidationError)) {
        throw new ValidationException(errors, USERS_ERROR_MESSAGES['INVALID_EMAIL']);
      }

      throw errors;
    }

    const existingUser = await this.usersDatabaseRepository.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException(USERS_ERROR_MESSAGES['CONFLICTING_EMAIL']);
    }

    // Execute
    const user = await this.usersDatabaseRepository.create(createUserDto);
    await this.usersEventsRepository.publishUserCreated(user);
    return { user };
  }
}
