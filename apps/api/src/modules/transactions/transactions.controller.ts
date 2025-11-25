import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateManualTransactionDto } from "./dto/create-manual-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @CurrentUser() user: { sub: string },
    @Query() query: QueryTransactionsDto
  ) {
    return this.service.findAll(user.sub, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post("manual")
  async createManual(
    @CurrentUser() user: { sub: string },
    @Body() body: CreateManualTransactionDto
  ) {
    return this.service.createManual({ ...body, userId: user.sub });
  }

  @UseGuards(JwtAuthGuard)
  @Get("summary")
  async summary(@CurrentUser() user: { sub: string }) {
    return this.service.getSummary(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get("suggestions")
  async suggestions(@CurrentUser() user: { sub: string }) {
    return this.service.getSuggestions(user.sub);
  }
}

