import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './quote.entity';
import { QuoteItem } from './quote-item.entity';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { OrdersModule } from '../orders/orders.module';
import { MailsModule } from '../mails/mails.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quote, QuoteItem]),
        OrdersModule,
        MailsModule,
    ],
    providers: [QuotesService],
    controllers: [QuotesController],
    exports: [QuotesService],
})
export class QuotesModule { }
