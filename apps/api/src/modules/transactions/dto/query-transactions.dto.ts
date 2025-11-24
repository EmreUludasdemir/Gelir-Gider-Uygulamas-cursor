import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";
import { TransactionSource, TransactionType } from "../../../shared/types";

export class QueryTransactionsDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsIn(["income", "expense"])
  type?: TransactionType;

  @IsOptional()
  @IsIn(["pdf", "manual"])
  source?: TransactionSource;

  @IsOptional()
  @Transform(({ value }) => value ?? undefined)
  dateFrom?: string;

  @IsOptional()
  @Transform(({ value }) => value ?? undefined)
  dateTo?: string;
}

