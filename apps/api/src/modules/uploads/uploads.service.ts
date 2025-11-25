import { Injectable, BadRequestException } from "@nestjs/common";
import { TransactionsService } from "../transactions/transactions.service";
import { PdfParserService } from "./pdf-parser.service";
import { ClassificationService } from "../classification/classification.service";

@Injectable()
export class UploadsService {
  constructor(
    private readonly transactions: TransactionsService,
    private readonly parser: PdfParserService,
    private readonly classifier: ClassificationService
  ) {}

  async processPdf(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("PDF dosyası zorunlu");
    }

    const parsed = await this.parser.parse(file);

    const enriched = parsed.map((item) => ({
      date: item.date,
      description: item.description,
      amount: item.amount,
      currency: item.currency ?? "TRY",
      source: "pdf",
      ...this.classifier.classify(item.description, item.amount)
    }));

    await this.transactions.bulkInsert(userId, enriched);

    return {
      total: parsed.length,
      lowConfidence: enriched.filter((item) => item.confidence < 70).length
    };
  }
}

