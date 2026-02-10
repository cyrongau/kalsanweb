import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async findAll(filters: { category?: string, brand?: string, condition?: string, q?: string, sort?: string, limit?: string } = {}): Promise<Product[]> {
        const { category, brand, condition, q, sort, limit } = filters;
        this.logger.log(`findAll filters: ${JSON.stringify(filters)}`);

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

        if (limit) {
            queryBuilder.take(parseInt(limit));
        }

        const results = await queryBuilder.getMany();
        this.logger.log(`findAll results count: ${results.length}`);
        return results;
    }

    findOne(id: string): Promise<Product | null> {
        return this.productsRepository.findOne({
            where: { id },
            relations: ['brand', 'category', 'condition']
        });
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
        try {
            // Sanitize data by removing non-entity fields that might come from frontend
            const { id: _, created_at: __, updated_at: ___, universalFit: ____, ...createData } = data as any;

            // Convert empty strings to null for UUID fields to avoid PostgreSQL errors
            if (createData.condition_id === '') createData.condition_id = null;
            if (createData.brand_id === '') createData.brand_id = null;
            if (createData.category_id === '') createData.category_id = null;

            this.logger.log(`Creating product with SKU: ${createData.sku}`);
            const product = this.productsRepository.create(createData as any) as unknown as Product;
            return await this.productsRepository.save(product);
        } catch (error) {
            this.logger.error(`Failed to create product: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`System error during product creation: ${error.message}`);
        }
    }

    async update(id: string, data: Partial<Product>): Promise<Product> {
        try {
            // Sanitize data
            const { id: _, created_at: __, updated_at: ___, universalFit: ____, ...updateData } = data as any;

            // Convert empty strings to null for UUID fields
            if (updateData.condition_id === '') updateData.condition_id = null;
            if (updateData.brand_id === '') updateData.brand_id = null;
            if (updateData.category_id === '') updateData.category_id = null;

            await this.productsRepository.update(id, updateData as any);
            const updated = await this.findOne(id);
            if (!updated) throw new NotFoundException('Product not found');
            return updated;
        } catch (error) {
            this.logger.error(`Failed to update product ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`System error during product update: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting product: ${id}`);
            await this.productsRepository.delete(id);
        } catch (error) {
            this.logger.error(`Failed to delete product ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`System error during product deletion: ${error.message}`);
        }
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
