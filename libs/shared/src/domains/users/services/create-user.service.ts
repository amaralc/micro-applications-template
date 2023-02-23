import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../errors/error-messages';
import { UserConflictException } from '../errors/user-conflict-exception';
import { UsersDatabaseRepository } from '../repositories/database/database.repository';
import { UsersEventsRepository } from '../repositories/events/events.repository';

@Injectable()
export class CreateUserService {
  constructor(
    private usersDatabaseRepository: UsersDatabaseRepository,
    private usersEventsRepository: UsersEventsRepository
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<{ user: User }> {
    // Validate or reject
    const createUserDtoInstance = plainToInstance(CreateUserDto, createUserDto);

    try {
      await validateOrReject(createUserDtoInstance);
    } catch (errors) {
      if (
        Array.isArray(errors) &&
        errors.every((error) => error instanceof ValidationError)
      ) {
        throw new ValidationException(
          errors,
          USERS_ERROR_MESSAGES['VALIDATION']['INVALID_EMAIL']
        );
      }

      throw errors;
    }

    const existingUser = await this.usersDatabaseRepository.findByEmail(
      createUserDto.email
    );

    if (existingUser) {
      throw new UserConflictException(
        USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }

    // Execute
    const user = await this.usersDatabaseRepository.create(createUserDto);
    await this.usersEventsRepository.publishUserCreated(user);
    return { user };
  }
}
