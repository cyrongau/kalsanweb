import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
    private readonly logger = new Logger(BrandsService.name);

    constructor(
        @InjectRepository(Brand)
        private brandsRepository: Repository<Brand>,
    ) { }

    async findAll(): Promise<Brand[]> {
        try {
            return await this.brandsRepository.find({ order: { name: 'ASC' } });
        } catch (error) {
            this.logger.error(`Failed to fetch brands: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error fetching brands catalog');
        }
    }

    async findBySlug(slug: string): Promise<Brand> {
        const brand = await this.brandsRepository.findOne({ where: { slug } });
        if (!brand) throw new NotFoundException('Brand not found');
        return brand;
    }

    async create(data: Partial<Brand>): Promise<Brand> {
        try {
            const { id: _, created_at: __, updated_at: ___, products: ____, products_count: _____, ...createData } = data as any;
            const brand = this.brandsRepository.create(createData as any) as unknown as Brand;
            return await this.brandsRepository.save(brand);
        } catch (error) {
            this.logger.error(`Failed to create brand: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`System error during brand creation: ${error.message}`);
        }
    }

    async update(id: string, data: Partial<Brand>): Promise<Brand> {
        try {
            const { id: _, created_at: __, updated_at: ___, products: ____, products_count: _____, ...updateData } = data as any;
            await this.brandsRepository.update(id, updateData as any);
            const updated = await this.brandsRepository.findOneBy({ id });
            if (!updated) throw new NotFoundException('Brand not found');
            return updated;
        } catch (error) {
            this.logger.error(`Failed to update brand ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`System error during brand update: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.brandsRepository.delete(id);
        } catch (error) {
            this.logger.error(`Failed to delete brand ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error deleting brand');
        }
    }
}
