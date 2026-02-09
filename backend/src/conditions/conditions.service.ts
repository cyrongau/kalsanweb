import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Condition } from './condition.entity';

@Injectable()
export class ConditionsService {
    constructor(
        @InjectRepository(Condition)
        private conditionsRepository: Repository<Condition>,
    ) { }

    findAll(): Promise<Condition[]> {
        return this.conditionsRepository.find();
    }

    findOne(id: string): Promise<Condition | null> {
        return this.conditionsRepository.findOne({ where: { id } });
    }

    findBySlug(slug: string): Promise<Condition | null> {
        return this.conditionsRepository.findOne({ where: { slug } });
    }

    async create(data: Partial<Condition>): Promise<Condition> {
        const condition = this.conditionsRepository.create(data);
        return this.conditionsRepository.save(condition);
    }

    async update(id: string, data: Partial<Condition>): Promise<Condition | null> {
        await this.conditionsRepository.update(id, data);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        await this.conditionsRepository.delete(id);
    }
}
