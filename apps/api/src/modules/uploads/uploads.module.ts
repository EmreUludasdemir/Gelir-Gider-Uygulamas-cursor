import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";
import { TransactionsModule } from "../transactions/transactions.module";
import { PdfParserService } from "./pdf-parser.service";
import { ClassificationModule } from "../classification/classification.module";

@Module({
  imports: [TransactionsModule, ClassificationModule],
  controllers: [UploadsController],
  providers: [UploadsService, PdfParserService]
})
export class UploadsModule {}

