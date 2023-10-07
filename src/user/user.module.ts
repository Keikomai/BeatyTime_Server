import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './user.model';
import { UserController } from './user.controler';
import { UserService } from './user.service';
import { AuthGuard } from './guards/auth.guards';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/test'),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
