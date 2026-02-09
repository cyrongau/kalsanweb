import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Quote, QuoteStatus } from '../quotes/quote.entity';
import { Product } from '../products/product.entity';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Quote)
        private quotesRepository: Repository<Quote>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async getOverview() {
        const totalInquiries = await this.quotesRepository.count();
        const pendingQuotes = await this.quotesRepository.count({ where: { status: QuoteStatus.PENDING } });
        const newCustomers = await this.usersRepository.count({
            where: { role: UserRole.CUSTOMER },
        });
        const lowStockAlerts = await this.productsRepository.count({
            where: { quantity: LessThan(10) },
        });

        return {
            totalInquiries,
            pendingQuotes,
            newCustomers,
            lowStockAlerts,
        };
    }

    async getRecentInquiries() {
        return this.quotesRepository.find({
            take: 4,
            order: { created_at: 'DESC' },
            relations: ['items', 'user'], // Include user for dashboard display
        });
    }

    async getTrends() {
        // This is a simplified trend calculation. 
        // In a real app, you would group by day/month.
        const bars = [40, 60, 45, 75, 55, 35, 65, 50, 60, 70, 40, 80, 75, 45]; // Keeping format but can be replaced with real query logic
        return {
            bars,
            peakDemand: 'Tue, Oct 24',
            averageDaily: 28,
            increasePercentage: 18,
        };
    }
}
