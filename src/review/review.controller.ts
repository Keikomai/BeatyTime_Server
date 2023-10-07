import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/user/types/role.enum';
import { Roles } from 'src/user/decorates/roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guards';
import { RolesGuard } from 'src/user/guards/role.guards';
import { CreateReviewDto } from './dto/createReview.dto';
import { ReviewService } from './review.service';
import { ReviewResponseInterface } from './types/review.type';
import { User } from 'src/user/decorates/userDecorators';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  async createReview(
    @User('id') currentUserId: string,
    @Body('review') createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseInterface> {
    const review = await this.reviewService.createReview(
      currentUserId,
      createReviewDto,
    );

    return this.reviewService.buildReviewResponse(review);
  }
}
