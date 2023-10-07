import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ReviewStars } from './types/review.type';

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ timestamps: true })
export class ReviewModel {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rating: ReviewStars;

  @Prop()
  createdAt: Date;

  @Prop()
  userId: string;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
