import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { NotificationSettingsService } from "./notification-settings.service";
import { NotificationSettingsController } from "./notification-settings.controller";

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, NotificationSettingsService],
  controllers: [NotificationSettingsController]
})
export class NotificationsModule {}

