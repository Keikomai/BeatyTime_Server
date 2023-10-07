import { JWT_SECRET } from '../../config';
import { ExpressRequestInterface } from '../../types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';
import { Model } from 'mongoose';
import { UserDocument } from '../user.model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization;
    try {
      const decode = verify(token, JWT_SECRET);

      const user = await this.userService.findUserById(decode._id);

      req.user = user;

      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
