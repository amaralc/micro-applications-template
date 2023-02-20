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
export class CreateUserUseCase {
  constructor(
    private usersDatabaseRepository: UsersDatabaseRepository,
    private usersEventsRepository: UsersEventsRepository
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<{ user: User }> {
    // Validate or reject
    const createUserDtoInstance = plainToInstance(CreateUserDto, createUserDto);
    await validateOrReject(createUserDtoInstance).catch(
      (validationErrors: ValidationError[]) => {
        throw new ValidationException(
          validationErrors,
          USERS_ERROR_MESSAGES['VALIDATION']['INVALID_EMAIL']
        );
      }
    );

    const existingUser = await this.usersDatabaseRepository.findByEmail(
      createUserDto.email
    );

    if (existingUser) {
      throw new UserConflictException();
    }

    // Execute
    const user = await this.usersDatabaseRepository.create(createUserDto);

    // Publish
    await this.usersEventsRepository.publishUserCreated(user);

    // Return
    return { user };
  }
}
