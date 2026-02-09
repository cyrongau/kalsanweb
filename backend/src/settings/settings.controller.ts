import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    getSettings() {
        return this.settingsService.getSettings();
    }

    @Patch()
    updateSettings(@Body() updates: Record<string, any>) {
        return this.settingsService.updateSettings(updates);
    }
}
