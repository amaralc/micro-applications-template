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

      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof AxiosError).toEqual(true);
      if (error instanceof AxiosError) {
        expect(error.response.status).toEqual(400);
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

      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof AxiosError).toEqual(true);
      if (error instanceof AxiosError) {
        expect(error.response.status).toEqual(409);
      }
    }
  });
});
