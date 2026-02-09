import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quote } from './quote.entity';
import { Product } from '../products/product.entity';

@Entity('quote_items')
export class QuoteItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Quote, (quote) => quote.items)
    quote: Quote;

    @ManyToOne(() => Product)
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    unit_price: number;
}
