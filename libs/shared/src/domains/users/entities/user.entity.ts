import { randomUUID } from 'crypto';

export class User {
  id: string;
  email: string;

  constructor(email: string) {
    this.id = randomUUID();
    this.email = email;
  }
}
