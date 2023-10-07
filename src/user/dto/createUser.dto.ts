import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../types/role.enum';

export class CreateUSerDto {
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly role: Role;
}
