import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('overview')
    getOverview() {
        return this.statsService.getOverview();
    }

    @Get('recent-inquiries')
    getRecentInquires() {
        return this.statsService.getRecentInquiries();
    }

    @Get('trends')
    getTrends() {
        return this.statsService.getTrends();
    }
}
