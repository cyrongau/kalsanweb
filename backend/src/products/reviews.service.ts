import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
    ) { }

    async create(userId: string, createReviewDto: any): Promise<Review> {
        const review = this.reviewsRepository.create({
            ...createReviewDto,
            user_id: userId,
            status: 'pending' // Always pending initially
        });
        return (await this.reviewsRepository.save(review) as unknown) as Review;
    }

    // Public: Get approved reviews for a product
    async findByProduct(productId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { product_id: productId, status: 'approved' },
            relations: ['user'],
            order: { created_at: 'DESC' }
        });
    }

    // Admin: Get all reviews
    async findAll(): Promise<Review[]> {
        return this.reviewsRepository.find({
            relations: ['user', 'product'], // Load product to show name in admin
            order: { created_at: 'DESC' }
        });
    }

    // Admin: Approve/Reject
    async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<Review> {
        const review = await this.reviewsRepository.findOneBy({ id });
        if (!review) throw new NotFoundException('Review not found');

        review.status = status;
        return this.reviewsRepository.save(review);
    }

    // Admin: Delete
    async remove(id: string): Promise<void> {
        await this.reviewsRepository.delete(id);
    }
}
