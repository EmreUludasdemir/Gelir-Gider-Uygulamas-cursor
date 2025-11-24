import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { TransactionType } from "../../../shared/types";

export class CreateManualTransactionDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsEnum(["income", "expense"], {
    message: "type sadece income veya expense olabilir"
  })
  type!: TransactionType;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  categoryLabel?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}

