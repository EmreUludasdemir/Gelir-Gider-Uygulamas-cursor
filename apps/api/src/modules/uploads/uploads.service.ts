import { Injectable, BadRequestException } from "@nestjs/common";
import { TransactionsService } from "../transactions/transactions.service";

@Injectable()
export class UploadsService {
  constructor(private readonly transactions: TransactionsService) {}

  processPdf(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("PDF dosyası zorunlu");
    }

    const parsed = this.mockParse(file);

    this.transactions.bulkInsert(
      parsed.map((item) => ({
        userId: "demo-user",
        accountId: item.accountId ?? "pdf-account",
        date: item.date,
        description: item.description,
        amount: item.amount,
        currency: item.currency ?? "TRY",
        source: "pdf",
        type: item.amount >= 0 ? "income" : "expense",
        categoryLabel: item.category ?? "Bilinmeyen",
        confidence: item.confidence ?? 60
      }))
    );

    return {
      total: parsed.length,
      lowConfidence: parsed.filter((item) => (item.confidence ?? 0) < 70).length
    };
  }

  private mockParse(file: Express.Multer.File) {
    const content = file.buffer?.toString("utf8") ?? "";
    if (!content.trim()) {
      return [
        {
          date: new Date().toISOString().slice(0, 10),
          description: file.originalname.replace(".pdf", ""),
          amount: -250.5,
          currency: "TRY",
          category: "Genel Gider",
          confidence: 65
        }
      ];
    }

    return content
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [date, description, amount, currency, category] = line.split("|");
        return {
          date: date ?? new Date().toISOString().slice(0, 10),
          description: description ?? "Bilinmeyen",
          amount: Number(amount) || 0,
          currency: currency ?? "TRY",
          category: category ?? "Genel"
        };
      });
  }
}

