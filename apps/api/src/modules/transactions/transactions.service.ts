import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DashboardSummary,
  TransactionEntity,
  TransactionSuggestion
} from "../../shared/types";
import { CreateManualTransactionDto } from "./dto/create-manual-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";

@Injectable()
export class TransactionsService {
  private transactions: TransactionEntity[] = [];

  constructor() {
    this.seedDemoData();
  }

  findAll(query?: QueryTransactionsDto): TransactionEntity[] {
    if (!query) {
      return this.transactions;
    }
    return this.transactions.filter((tx) => {
      const matchesCategory = query.categoryId
        ? tx.categoryId === query.categoryId ||
          tx.categoryLabel?.toLowerCase() === query.categoryId.toLowerCase()
        : true;
      const matchesType = query.type ? tx.type === query.type : true;
      const matchesSource = query.source ? tx.source === query.source : true;
      const matchesDateFrom = query.dateFrom
        ? new Date(tx.date) >= new Date(query.dateFrom)
        : true;
      const matchesDateTo = query.dateTo
        ? new Date(tx.date) <= new Date(query.dateTo)
        : true;
      return (
        matchesCategory &&
        matchesType &&
        matchesSource &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
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
      source: "manual",
      type: payload.type,
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

  getSummary(): DashboardSummary {
    const now = new Date();
    const month = now.toLocaleDateString("tr-TR", {
      month: "long",
      year: "numeric"
    });
    const incomes = this.transactions.filter((tx) => tx.type === "income");
    const expenses = this.transactions.filter((tx) => tx.type === "expense");

    const totalIncome = incomes.reduce(
      (sum, tx) => sum + Math.abs(tx.amount),
      0
    );
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
      recurringPayments: this.detectRecurringPayments()
    };
  }

  getSuggestions(): TransactionSuggestion[] {
    return this.transactions
      .filter((tx) => (tx.confidence ?? 100) < 75)
      .map((tx) => ({
        id: tx.id,
        description: tx.description,
        amount: tx.amount,
        currency: tx.currency,
        detectedCategory: tx.categoryLabel,
        confidence: tx.confidence ?? 0,
        createdAt: tx.createdAt
      }));
  }

  private detectRecurringPayments() {
    const grouped = this.transactions.reduce<Record<string, TransactionEntity[]>>(
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

  private seedDemoData() {
    if (this.transactions.length) {
      return;
    }
    const today = new Date();
    const demoData: Array<Omit<TransactionEntity, "id" | "createdAt">> = [
      {
        userId: "demo-user",
        accountId: "akbank",
        date: today.toISOString(),
        description: "Spotify",
        amount: -89.99,
        currency: "TRY",
        source: "pdf",
        type: "expense",
        categoryId: "subscriptions",
        categoryLabel: "Abonelik",
        confidence: 98
      },
      {
        userId: "demo-user",
        accountId: "garanti",
        date: new Date(today.getTime() - 86400000).toISOString(),
        description: "Migros Online",
        amount: -540.45,
        currency: "TRY",
        source: "pdf",
        type: "expense",
        categoryId: "groceries",
        categoryLabel: "Market",
        confidence: 70
      },
      {
        userId: "demo-user",
        accountId: "isbank",
        date: new Date(today.getTime() - 86400000 * 2).toISOString(),
        description: "Serbest Çalışma Ödemesi",
        amount: 15000,
        currency: "TRY",
        source: "manual",
        type: "income",
        categoryId: "income",
        categoryLabel: "Gelir",
        confidence: 100
      },
      {
        userId: "demo-user",
        accountId: "akbank",
        date: new Date(today.getTime() - 86400000 * 3).toISOString(),
        description: "Apple Music",
        amount: -44.99,
        currency: "TRY",
        source: "pdf",
        type: "expense",
        categoryId: "subscriptions",
        categoryLabel: "Abonelik",
        confidence: 60
      }
    ];
    this.transactions = demoData.map((item) => ({
      ...item,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    }));
  }
}

