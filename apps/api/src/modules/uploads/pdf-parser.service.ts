import { Injectable, Logger } from "@nestjs/common";

type ParsedRow = {
  date: string;
  description: string;
  amount: number;
  currency: string;
};

@Injectable()
export class PdfParserService {
  private readonly logger = new Logger(PdfParserService.name);
  private readonly parserUrl =
    process.env.PDF_PARSER_URL ?? "http://localhost:8001/parse";

  async parse(file: Express.Multer.File): Promise<ParsedRow[]> {
    try {
      const formData = new FormData();
      const blob = new Blob([file.buffer]);
      formData.append("file", blob, file.originalname);
      const response = await fetch(this.parserUrl, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Parser error: ${response.statusText}`);
      }
      const payload = (await response.json()) as {
        transactions: ParsedRow[];
      };
      return payload.transactions;
    } catch (error) {
      this.logger.warn(
        `PDF parser servisine erişilemedi, mock parse çalışacak: ${String(error)}`
      );
      return this.mockParse(file);
    }
  }

  private mockParse(file: Express.Multer.File): ParsedRow[] {
    const content = file.buffer?.toString("utf8") ?? "";
    if (!content.trim()) {
      return [
        {
          date: new Date().toISOString(),
          description: file.originalname.replace(".pdf", ""),
          amount: -250.5,
          currency: "TRY"
        }
      ];
    }

    return content
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [date, description, amount, currency] = line.split("|");
        return {
          date: date ?? new Date().toISOString(),
          description: description ?? "Bilinmeyen",
          amount: Number(amount) || 0,
          currency: currency ?? "TRY"
        };
      });
  }
}

