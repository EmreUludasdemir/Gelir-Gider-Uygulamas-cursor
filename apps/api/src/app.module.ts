import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    UploadsModule,
    NotificationsModule
  ]
})
export class AppModule {}

