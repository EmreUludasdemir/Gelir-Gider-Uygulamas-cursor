import { Body, Controller, Get, Post } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateManualTransactionDto } from "./dto/create-manual-transaction.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post("manual")
  createManual(@Body() body: CreateManualTransactionDto) {
    const userId = "demo-user";
    return this.service.createManual({ ...body, userId });
  }
}

