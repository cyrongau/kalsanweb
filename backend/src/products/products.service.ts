import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async findAll(filters: { category?: string, brand?: string, condition?: string, q?: string, sort?: string } = {}): Promise<Product[]> {
        const { category, brand, condition, q, sort } = filters;

        const queryBuilder = this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.brand', 'brand')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.condition', 'condition');

        if (category) {
            queryBuilder.andWhere('category.slug = :category', { category });
        }

        if (brand) {
            queryBuilder.andWhere('brand.slug = :brand', { brand });
        }

        if (condition) {
            queryBuilder.andWhere('condition.slug = :condition', { condition });
        }

        if (q) {
            queryBuilder.andWhere(
                '(product.name ILike :q OR product.sku ILike :q)',
                { q: `%${q}%` }
            );
        }

        switch (sort) {
            case 'newest':
                queryBuilder.orderBy('product.created_at', 'DESC');
                break;
            case 'price_low':
                queryBuilder.orderBy('product.price', 'ASC');
                break;
            case 'price_high':
                queryBuilder.orderBy('product.price', 'DESC');
                break;
            default:
                queryBuilder.orderBy('product.created_at', 'DESC');
        }

        return queryBuilder.getMany();
    }

    findOne(id: string): Promise<Product | null> {
        return this.productsRepository.findOneBy({ id });
    }

    findByBrand(brandId: string): Promise<Product[]> {
        return this.productsRepository.findBy({ brand_id: brandId });
    }

    findByBrandSlug(slug: string): Promise<Product[]> {
        return this.productsRepository.find({
            where: { brand: { slug } },
            relations: ['brand', 'category']
        });
    }

    findByCategory(categoryId: string): Promise<Product[]> {
        return this.productsRepository.findBy({ category_id: categoryId });
    }

    async create(data: Partial<Product>): Promise<Product> {
        const product = this.productsRepository.create(data);
        return this.productsRepository.save(product);
    }

    async update(id: string, data: Partial<Product>): Promise<Product> {
        await this.productsRepository.update(id, data);
        const updated = await this.findOne(id);
        if (!updated) throw new Error('Product not found');
        return updated;
    }

    search(query: string): Promise<Product[]> {
        return this.productsRepository.find({
            where: [
                { name: ILike(`%${query}%`) },
                { sku: ILike(`%${query}%`) }
            ],
            take: 10 // Limit results for prediction
        });
    }
}
