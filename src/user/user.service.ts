import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.model';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare, hash } from 'bcrypt';
import { CreateUSerDto } from './dto/createUser.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/updatePassword.to';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userRepository: Model<UserModel>,
  ) {}

  async createUser(createUserDto: CreateUSerDto): Promise<UserModel> {
    const errorResponse = {
      errors: {},
    };
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUserName = await this.userRepository.findOne({
      userName: createUserDto.userName,
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'Email has been taken';
    }
    if (userByUserName) {
      errorResponse.errors['username'] = 'Username has been taken';
    }
    if (userByEmail || userByUserName) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const createdUser = new this.userRepository({
      email: createUserDto.email,
      id: randomUUID(),
      password: await hash(createUserDto.password, 10),
      role: createUserDto.role,
    });

    return createdUser.save();
  }

  async findAllUser(): Promise<UserModel[]> {
    return this.userRepository.find();
  }

  async login(loginUserDto: LoginUserDto): Promise<UserModel> {
    const errorResponse = {
      errors: {},
    };

    const userByEmail = await this.userRepository.findOne({
      email: loginUserDto.email,
    });

    if (!userByEmail) {
      errorResponse.errors['email'] = 'Email is not exist';
    }

    if (!userByEmail) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      userByEmail.password,
    );

    if (!isPasswordCorrect) {
      errorResponse.errors['credentials'] = 'Credentials is not correct';
    }

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return userByEmail;
  }

  async deleteUserById(userId: string): Promise<UserModel | null> {
    const user = await this.userRepository
      .findOneAndDelete({ id: userId })
      .exec();
    // const deletedUser = await this.userRepository
    //   .findByIdAndDelete(userId)
    //   .exec();

    return user;
  }

  async updatePassword(
    id: string,
    updatePassword: UpdatePasswordDto,
  ): Promise<UserModel | null> {
    const userById = await this.userRepository.findOne({
      id: id,
    });

    if (!userById) {
      throw new HttpException(
        'User is not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isTheSamePassword = await compare(
      updatePassword.password,
      userById.password,
    );

    if (isTheSamePassword) {
      throw new HttpException(
        'New password must not be the same as the old password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPassword = await hash(updatePassword.password, 10);

    userById.password = newPassword;
    await userById.save();

    return userById;
  }

  generateJwt(user: UserModel): string {
    return sign(
      {
        _id: user._id,
        username: user.userName,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' },
    );
  }

  findUserById(id: string): Promise<UserModel> {
    return this.userRepository.findOne({
      _id: id, // Use _id for MongoDB ObjectId
    });
  }

  buildUserResponse(user: UserModel): any {
    return {
      user: {
        userName: user?.userName,
        email: user?.email,
        id: user.id,
        phoneNumber: user?.phoneNumber,
        token: this.generateJwt(user),
        role: user?.role,
      },
    };
  }
}
