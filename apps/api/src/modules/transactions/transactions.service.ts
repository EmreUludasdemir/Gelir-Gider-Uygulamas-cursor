import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  TransactionEntity,
  TransactionType,
  TransactionSource
} from "../../shared/types";
import { CreateManualTransactionDto } from "./dto/create-manual-transaction.dto";

@Injectable()
export class TransactionsService {
  private transactions: TransactionEntity[] = [];

  findAll(): TransactionEntity[] {
    return this.transactions;
  }

  createManual(
    payload: CreateManualTransactionDto & { userId: string }
  ): TransactionEntity {
    const entity: TransactionEntity = {
      id: randomUUID(),
      userId: payload.userId,
      accountId: payload.accountId ?? "manual-account",
      date: payload.date,
      description: payload.description,
      amount: payload.amount,
      currency: payload.currency ?? "TRY",
      source: ("manual" as TransactionSource) ?? "manual",
      type: payload.type as TransactionType,
      categoryId: payload.categoryId,
      categoryLabel: payload.categoryLabel,
      confidence: 100,
      createdAt: new Date().toISOString()
    };
    this.transactions.unshift(entity);
    return entity;
  }

  bulkInsert(
    items: Array<
      Omit<TransactionEntity, "id" | "createdAt"> & { confidence?: number }
    >
  ): TransactionEntity[] {
    const inserted = items.map((item) => ({
      ...item,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    }));
    this.transactions = [...inserted, ...this.transactions];
    return inserted;
  }
}

