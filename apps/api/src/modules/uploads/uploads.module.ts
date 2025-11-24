import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";
import { TransactionsModule } from "../transactions/transactions.module";

@Module({
  imports: [TransactionsModule],
  controllers: [UploadsController],
  providers: [UploadsService]
})
export class UploadsModule {}

