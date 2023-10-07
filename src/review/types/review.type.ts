import { ReviewModel } from '../review.model';

export type ReviewStars = 1 | 2 | 3 | 4 | 5;

export interface ReviewResponseInterface {
  review: ReviewModel;
}
