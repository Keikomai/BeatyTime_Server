import { UserModel } from '../user.model';

export interface UserResponseInterface {
  user: Omit<UserModel, 'password'> & {
    token: string;
  };
}
