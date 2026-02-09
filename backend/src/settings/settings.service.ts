import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private settingsRepository: Repository<Setting>,
    ) { }

    async getSettings(): Promise<Record<string, any>> {
        const settings = await this.settingsRepository.find();
        return settings.reduce((acc, s) => {
            try {
                acc[s.key] = JSON.parse(s.value);
            } catch {
                acc[s.key] = s.value;
            }
            return acc;
        }, {} as Record<string, any>);
    }

    async updateSettings(updates: Record<string, any>): Promise<void> {
        for (const [key, value] of Object.entries(updates)) {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await this.settingsRepository.upsert({ key, value: stringValue }, ['key']);
        }
    }
}
