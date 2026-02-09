import { Module, Global } from '@nestjs/common';
import { MailsService } from './mails.service';
import { SettingsModule } from '../settings/settings.module';

@Global()
@Module({
    imports: [SettingsModule],
    providers: [MailsService],
    exports: [MailsService],
})
export class MailsModule { }
