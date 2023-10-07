import { Request } from 'express';
import { UserModel } from '../user/user.model';

export interface ExpressRequestInterface extends Request {
  user?: UserModel;
}
