import { Injectable } from "@nestjs/common";
import { TransactionType, TransactionSource } from "../../shared/types";

const keywordMap: Record<string, { category: string; type: TransactionType }> = {
  spotify: { category: "Abonelik", type: "expense" },
  netflix: { category: "Abonelik", type: "expense" },
  apple: { category: "Abonelik", type: "expense" },
  migros: { category: "Market", type: "expense" },
  carrefour: { category: "Market", type: "expense" },
  salary: { category: "Gelir", type: "income" },
  maaş: { category: "Gelir", type: "income" }
};

@Injectable()
export class ClassificationService {
  classify(description: string, amount: number) {
    const normalized = description.toLowerCase();
    for (const keyword of Object.keys(keywordMap)) {
      if (normalized.includes(keyword)) {
        const entry = keywordMap[keyword];
        return {
          categoryLabel: entry.category,
          type: entry.type,
          confidence: 90
        };
      }
    }
    return {
      categoryLabel: amount >= 0 ? "Gelir" : "Genel",
      type: amount >= 0 ? ("income" as TransactionType) : ("expense" as TransactionType),
      confidence: 60
    };
  }

  inferSource(): TransactionSource {
    return "pdf";
  }
}


