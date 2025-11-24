"use client";

import { StatCard } from "../../../components/StatCard";
import { PdfUpload } from "../../../components/PdfUpload";
import { ManualTransactionForm } from "../../../components/ManualTransactionForm";
import {
  Transaction,
  TransactionTable
} from "../../../components/TransactionTable";
import { createManualTransaction, uploadPdf } from "../../../lib/api";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-11-05",
    description: "Spotify",
    amount: -109.99,
    currency: "TRY",
    category: "Abonelik",
    source: "pdf",
    confidence: 98
  },
  {
    id: "2",
    date: "2025-11-04",
    description: "Migros",
    amount: -865.5,
    currency: "TRY",
    category: "Market",
    source: "pdf",
    confidence: 72
  },
  {
    id: "3",
    date: "2025-11-03",
    description: "Serbest Çalışma Ödemesi",
    amount: 12500,
    currency: "TRY",
    category: "Gelir",
    source: "manual",
    confidence: 100
  }
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <header className="mx-auto max-w-6xl pb-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Hoş geldin Emre
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Finans Dashboard
        </h1>
      </header>

      <section className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Kasım Gelir" value="₺32.500" delta={{ value: "%12", direction: "up" }} />
        <StatCard label="Kasım Gider" value="₺18.420" delta={{ value: "%5", direction: "down" }} />
        <StatCard label="Abonelikler" value="₺2.145" />
        <StatCard label="PDF Kuyruğu" value="3 dosya" />
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-3">
        <PdfUpload
          onUpload={async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            await uploadPdf(formData);
          }}
        />
        <ManualTransactionForm
          onSubmit={async (payload) => {
            await createManualTransaction(payload);
          }}
        />
      </section>

      <section className="mx-auto mt-8 max-w-6xl space-y-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Son İşlemler
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Kategori önerisi bekleyenler
          </h2>
        </div>
        <TransactionTable transactions={mockTransactions} />
      </section>
    </div>
  );
}

