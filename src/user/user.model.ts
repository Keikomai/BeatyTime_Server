import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Role } from './types/role.enum';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ timestamps: true })
export class UserModel extends Document {
  @Prop()
  id: Types.ObjectId;

  @Prop()
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
