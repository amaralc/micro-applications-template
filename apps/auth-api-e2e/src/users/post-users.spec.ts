import { USERS_ERROR_MESSAGES } from '@auth/shared/domains/users/errors/error-messages';
import { faker } from '@faker-js/faker';
import axios, { AxiosError } from 'axios';

describe('[POST] /users', () => {
  it('[201] should create new user', async () => {
    const newUserEmail = faker.internet.email();
    const res = await axios.post(`/users`, {
      email: newUserEmail,
    });

    expect(res.status).toBe(201);
    expect(res.data).toEqual(
      expect.objectContaining({
        user: {
          email: newUserEmail,
          id: expect.any(String),
        },
      })
    );
  });

  it('[400] should not create user with invalid e-mail address', async () => {
    const invalidEmail = 'invalid-email';
    try {
      await axios.post(`/users`, {
        email: invalidEmail,
      });

      expect('this-branch').toEqual('should-never-pass');
    } catch (error) {
      expect(error instanceof AxiosError).toEqual(true);
      if (error instanceof AxiosError) {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual(
          expect.objectContaining({
            message: [USERS_ERROR_MESSAGES['VALIDATION']['INVALID_EMAIL']],
          })
        );
      }
    }
  });

  it('[409] should not create two users with the same e-mail', async () => {
    const newUserEmail = faker.internet.email();
    try {
      await axios.post(`/users`, {
        email: newUserEmail,
      });

      await axios.post(`/users`, {
        email: newUserEmail,
      });

      expect('this-branch').toEqual('should-never-pass');
    } catch (error) {
      expect(error instanceof AxiosError).toEqual(true);
      if (error instanceof AxiosError) {
        expect(error.response.status).toEqual(409);
        expect(error.response.data).toEqual(
          expect.objectContaining({
            message: [USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']],
          })
        );
      }
    }
  });
});
