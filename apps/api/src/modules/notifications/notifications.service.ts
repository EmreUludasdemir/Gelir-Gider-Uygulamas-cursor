import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { ConsoleEmailProvider, EmailProvider } from "./email.provider";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly emailProvider: EmailProvider;

  constructor(private readonly prisma: PrismaService) {
    this.emailProvider = new ConsoleEmailProvider();
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async handleDailyNotifications() {
    this.logger.log("Günlük bildirim taraması başlatılıyor...");
    await this.sendSubscriptionReminders();
    await this.sendBudgetAlerts();
  }

  private async sendSubscriptionReminders() {
    const today = new Date();
    const targetDate = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 3);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        nextDueDate: {
          gte: today,
          lte: targetDate
        },
        user: {
          notificationSetting: {
            emailSubscriptionReminders: true
          }
        }
      },
      include: { user: true, category: true }
    });

    for (const sub of subscriptions) {
      await this.emailProvider.send({
        to: sub.user.email,
        subject: `Yaklaşan abonelik: ${sub.description}`,
        html: `<p>${sub.description} için ödeme tarihi yaklaşıyor: ${sub.nextDueDate.toDateString()}</p>`
      });
      await this.prisma.notification.create({
        data: {
          userId: sub.userId,
          type: "SUBSCRIPTION_REMINDER",
          channel: "EMAIL",
          payload: {
            subscriptionId: sub.id,
            nextDueDate: sub.nextDueDate
          },
          sentAt: new Date()
        }
      });
    }
  }

  private async sendBudgetAlerts() {
    const budgets = await this.prisma.budget.findMany({
      include: { category: true, user: { include: { notificationSetting: true } } }
    });

    for (const budget of budgets) {
      if (!budget.user.notificationSetting?.emailBudgetAlerts) continue;
      const spentAggregate = await this.prisma.transaction.aggregate({
        where: {
          userId: budget.userId,
          categoryId: budget.categoryId,
          occurredAt: {
            gte: budget.periodStart,
            lte: budget.periodEnd
          }
        },
        _sum: { amount: true }
      });
      const spent = Math.abs(Number(spentAggregate._sum.amount ?? 0));
      if (spent <= Number(budget.amount)) {
        continue;
      }
      await this.emailProvider.send({
        to: budget.user.email,
        subject: `Bütçe aşıldı: ${budget.category.name}`,
        html: `<p>${budget.category.name} bütçeniz aşıldı. Hedef: ₺${budget.amount}, Harcama: ₺${spent}</p>`
      });
      await this.prisma.notification.create({
        data: {
          userId: budget.userId,
          type: "BUDGET_ALERT",
          channel: "EMAIL",
          payload: {
            budgetId: budget.id,
            spent
          },
          sentAt: new Date()
        }
      });
    }
  }
}


