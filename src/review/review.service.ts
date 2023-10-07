import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewModel } from './review.model';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/createReview.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel.name)
    private readonly reviewRepository: Model<ReviewModel>,
  ) {}

  async createReview(
    currentUserId: string,
    createReview: CreateReviewDto,
  ): Promise<ReviewModel> {
    const createdReview = new this.reviewRepository({
      title: createReview.title,
      description: createReview.description,
      rating: createReview.rating,
      userId: currentUserId,
      id: randomUUID(),
    });

    return createdReview.save();
  }

  buildReviewResponse(review: ReviewModel): any {
    return {
      review: {
        title: review?.title,
        description: review?.description,
        id: review?.id,
        createdAt: review?.createdAt,
        rating: review?.rating,
        userId: review?.userId,
      },
    };
  }
}
