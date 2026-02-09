import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private brandsRepository: Repository<Brand>,
    ) { }

    async findAll(): Promise<Brand[]> {
        return this.brandsRepository.find({ order: { name: 'ASC' } });
    }

    async findBySlug(slug: string): Promise<Brand> {
        const brand = await this.brandsRepository.findOne({ where: { slug } });
        if (!brand) throw new NotFoundException('Brand not found');
        return brand;
    }

    async create(data: Partial<Brand>): Promise<Brand> {
        const { id: _, created_at: __, updated_at: ___, products: ____, products_count: _____, ...createData } = data as any;
        const brand = this.brandsRepository.create(createData as any) as unknown as Brand;
        return this.brandsRepository.save(brand);
    }

    async update(id: string, data: Partial<Brand>): Promise<Brand> {
        const { id: _, created_at: __, updated_at: ___, products: ____, products_count: _____, ...updateData } = data as any;
        await this.brandsRepository.update(id, updateData as any);
        const updated = await this.brandsRepository.findOneBy({ id });
        if (!updated) throw new NotFoundException('Brand not found');
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.brandsRepository.delete(id);
    }
}
