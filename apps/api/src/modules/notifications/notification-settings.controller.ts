import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { NotificationSettingsService } from "./notification-settings.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("notification-settings")
export class NotificationSettingsController {
  constructor(private readonly service: NotificationSettingsService) {}

  @Get()
  getMine(@CurrentUser() user: { sub: string }) {
    return this.service.getForUser(user.sub);
  }

  @Patch()
  updateMine(
    @CurrentUser() user: { sub: string },
    @Body()
    body: Partial<{
      emailSubscriptionReminders: boolean;
      emailBudgetAlerts: boolean;
    }>
  ) {
    return this.service.updateForUser(user.sub, body);
  }
}


