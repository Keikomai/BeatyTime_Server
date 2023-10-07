import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ReviewStars } from 'src/review/types/review.type';
import { UserModel } from 'src/user/user.model';
import { HydratedDocument, Types } from 'mongoose';

export type WorkerDocument = HydratedDocument<WorkerType>;

@Schema()
export class WorkerType extends UserModel {
  @Prop()
  id: Types.ObjectId;

  @Prop()
  age?: string;

  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  rating: ReviewStars;
  @Prop()
  bio?: string;
  @Prop({ required: true })
  experience: number;
  @Prop({ required: true })
  price: {
    [key: string]: string;
  }[];
}

export const WorkerSchema = SchemaFactory.createForClass(WorkerType);
