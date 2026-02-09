import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({
            relations: ['children'],
            where: { parent_id: IsNull() },
            order: { name: 'ASC' }
        });
    }

    async findBySlug(slug: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { slug },
            relations: ['children', 'parent']
        });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async create(data: Partial<Category>): Promise<Category> {
        const category = this.categoriesRepository.create(data);
        return this.categoriesRepository.save(category);
    }

    async update(id: string, data: Partial<Category>): Promise<Category> {
        await this.categoriesRepository.update(id, data);
        const updated = await this.categoriesRepository.findOneBy({ id });
        if (!updated) throw new NotFoundException('Category not found');
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.categoriesRepository.delete(id);
    }
}
