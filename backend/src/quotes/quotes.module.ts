import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './quote.entity';
import { QuoteItem } from './quote-item.entity';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Quote, QuoteItem])],
    providers: [QuotesService],
    controllers: [QuotesController],
    exports: [QuotesService],
})
export class QuotesModule { }
