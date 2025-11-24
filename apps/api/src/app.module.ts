import { Module } from "@nestjs/common";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { UploadsModule } from "./modules/uploads/uploads.module";

@Module({
  imports: [TransactionsModule, UploadsModule]
})
export class AppModule {}

