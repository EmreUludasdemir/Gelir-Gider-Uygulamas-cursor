import { Injectable } from "@nestjs/common";
import { Prisma, TransactionType as PrismaTransactionType } from "@prisma/client";
import {
  DashboardSummary,
  TransactionEntity,
  TransactionSuggestion,
  TransactionSource,
  TransactionType
} from "../../shared/types";
import { CreateManualTransactionDto } from "./dto/create-manual-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    query?: QueryTransactionsDto
  ): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        categoryId: query?.categoryId,
        type: query?.type
          ? this.toPrismaType(query.type)
          : undefined,
        source: query?.source
          ? this.toPrismaSource(query.source)
          : undefined,
        occurredAt: {
          gte: query?.dateFrom ? new Date(query.dateFrom) : undefined,
          lte: query?.dateTo ? new Date(query.dateTo) : undefined
        }
      },
      orderBy: { occurredAt: "desc" },
      include: { category: true }
    });
    return transactions.map((record) => this.mapTransaction(record));
  }

  async createManual(
    payload: CreateManualTransactionDto & { userId: string }
  ): Promise<TransactionEntity> {
    const record = await this.prisma.transaction.create({
      data: {
        userId: payload.userId,
        accountId: payload.accountId ?? undefined,
        description: payload.description,
        amount: new Prisma.Decimal(payload.amount),
        currency: payload.currency ?? "TRY",
        source: "MANUAL",
        type: this.toPrismaType(payload.type),
        categoryId: payload.categoryId,
        confidence: 100,
        occurredAt: new Date(payload.date)
      },
      include: { category: true }
    });
    return this.mapTransaction(record);
  }

  async bulkInsert(
    userId: string,
    items: Array<
      Omit<TransactionEntity, "id" | "createdAt" | "userId"> & {
        confidence?: number;
        categoryLabel?: string;
      }
    >
  ): Promise<TransactionEntity[]> {
    const results = await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.transaction.create({
          data: {
            userId,
            accountId: item.accountId ?? undefined,
            description: item.description,
            amount: new Prisma.Decimal(item.amount),
            currency: item.currency ?? "TRY",
            source: this.toPrismaSource(item.source),
            type: this.toPrismaType(item.type),
            categoryId: item.categoryId,
            confidence: item.confidence ?? 60,
            occurredAt: new Date(item.date)
          },
          include: { category: true }
        })
      )
    );
    return results.map((record) => this.mapTransaction(record));
  }

  async getSummary(userId: string): Promise<DashboardSummary> {
    const now = new Date();
    const month = now.toLocaleDateString("tr-TR", {
      month: "long",
      year: "numeric"
    });
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: { category: true }
    });
    const mapped = transactions.map((tx) => this.mapTransaction(tx));
    const incomes = mapped.filter((tx) => tx.type === "income");
    const expenses = mapped.filter((tx) => tx.type === "expense");

    const totalIncome = incomes.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalExpense = expenses.reduce(
      (sum, tx) => sum + Math.abs(tx.amount),
      0
    );

    const categoryTotals = expenses.reduce<Record<string, number>>(
      (acc, tx) => {
        const key = tx.categoryLabel ?? "Diğer";
        acc[key] = (acc[key] ?? 0) + Math.abs(tx.amount);
        return acc;
      },
      {}
    );

    const topCategories = Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category,
        total,
        percentage: totalExpense
          ? Number(((total / totalExpense) * 100).toFixed(1))
          : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);

    return {
      month,
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      balance: Number((totalIncome - totalExpense).toFixed(2)),
      changePercentage: 8.4,
      topCategories,
      recurringPayments: this.detectRecurringPayments(mapped)
    };
  }

  async getSuggestions(userId: string): Promise<TransactionSuggestion[]> {
    const lowConfidence = await this.prisma.transaction.findMany({
      where: { userId, confidence: { lt: 75 } },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    return lowConfidence.map((tx) => ({
      id: tx.id,
      description: tx.description,
      amount: Number(tx.amount),
      currency: tx.currency,
      detectedCategory: tx.category?.name,
      confidence: tx.confidence ?? 0,
      createdAt: tx.createdAt.toISOString()
    }));
  }

  private detectRecurringPayments(transactions: TransactionEntity[]) {
    const grouped = transactions.reduce<Record<string, TransactionEntity[]>>(
      (acc, tx) => {
        const key = tx.description.toLowerCase();
        acc[key] = acc[key] ? [...acc[key], tx] : [tx];
        return acc;
      },
      {}
    );

    return Object.values(grouped)
      .filter((items) => items.length >= 2)
      .slice(0, 3)
      .map((items) => {
        const sorted = [...items].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const latest = sorted[0];
        return {
          id: latest.id,
          description: latest.description,
          amount: Math.abs(latest.amount),
          nextDate: new Date(
            new Date(latest.date).getTime() + 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
          category: latest.categoryLabel ?? "Bilgi yok"
        };
      });
  }

  private mapTransaction(
    record: Prisma.TransactionGetPayload<{ include: { category: true } }>
  ): TransactionEntity {
    return {
      id: record.id,
      userId: record.userId,
      accountId: record.accountId,
      date: record.occurredAt.toISOString(),
      description: record.description,
      amount: Number(record.amount),
      currency: record.currency,
      source: this.fromPrismaSource(record.source),
      type: this.fromPrismaType(record.type),
      categoryId: record.categoryId ?? undefined,
      categoryLabel: record.category?.name,
      confidence: record.confidence ?? undefined,
      createdAt: record.createdAt.toISOString()
    };
  }

  private toPrismaType(type: TransactionType) {
    return type === "income"
      ? PrismaTransactionType.INCOME
      : PrismaTransactionType.EXPENSE;
  }

  private fromPrismaType(type: PrismaTransactionType): TransactionType {
    return type === PrismaTransactionType.INCOME ? "income" : "expense";
  }

  private toPrismaSource(source: TransactionSource) {
    return source === "manual" ? "MANUAL" : "PDF";
  }

  private fromPrismaSource(source: string): TransactionSource {
    return source === "MANUAL" ? "manual" : "pdf";
  }
}

