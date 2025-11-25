import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class NotificationSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    let setting = await this.prisma.notificationSetting.findUnique({
      where: { userId }
    });
    if (!setting) {
      setting = await this.prisma.notificationSetting.create({
        data: {
          userId
        }
      });
    }
    return setting;
  }

  async updateForUser(
    userId: string,
    payload: Partial<{
      emailSubscriptionReminders: boolean;
      emailBudgetAlerts: boolean;
    }>
  ) {
    await this.getForUser(userId);
    return this.prisma.notificationSetting.update({
      where: { userId },
      data: payload
    });
  }
}


