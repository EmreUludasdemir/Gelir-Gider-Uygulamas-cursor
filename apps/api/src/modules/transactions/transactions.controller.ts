import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateManualTransactionDto } from "./dto/create-manual-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll(@Query() query: QueryTransactionsDto) {
    return this.service.findAll(query);
  }

  @Post("manual")
  createManual(@Body() body: CreateManualTransactionDto) {
    const userId = "demo-user";
    return this.service.createManual({ ...body, userId });
  }

  @Get("summary")
  summary() {
    return this.service.getSummary();
  }

  @Get("suggestions")
  suggestions() {
    return this.service.getSuggestions();
  }
}

