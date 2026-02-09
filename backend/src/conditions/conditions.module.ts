import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Condition } from './condition.entity';
import { ConditionsService } from './conditions.service';
import { ConditionsController } from './conditions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Condition])],
    providers: [ConditionsService],
    controllers: [ConditionsController],
    exports: [ConditionsService],
})
export class ConditionsModule { }
