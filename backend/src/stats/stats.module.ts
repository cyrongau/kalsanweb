import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Order } from '../orders/order.entity';
import { Quote } from '../quotes/quote.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Quote, Product, User])],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule { }
