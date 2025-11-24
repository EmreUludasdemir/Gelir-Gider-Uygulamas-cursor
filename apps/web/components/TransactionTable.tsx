"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  source: "pdf" | "manual";
  confidence?: number;
};

type Props = {
  transactions: Transaction[];
};

export function TransactionTable({ transactions }: Props) {
  const rows = useMemo(
    () =>
      transactions.map((tx) => ({
        ...tx,
        formattedDate: format(new Date(tx.date), "d MMM yyyy", { locale: tr }),
        formattedAmount: new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: tx.currency
        }).format(tx.amount)
      })),
    [transactions]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Tarih</th>
            <th className="px-4 py-3">Açıklama</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3 text-right">Tutar</th>
            <th className="px-4 py-3 text-right">Kaynak</th>
            <th className="px-4 py-3 text-right">Güven</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              <td className="px-4 py-3 text-slate-600">{row.formattedDate}</td>
              <td className="px-4 py-3 font-medium text-slate-900">
                {row.description}
              </td>
              <td className="px-4 py-3 text-slate-600">{row.category}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {row.formattedAmount}
              </td>
              <td className="px-4 py-3 text-right text-slate-500 uppercase">
                {row.source}
              </td>
              <td className="px-4 py-3 text-right text-slate-500">
                {row.confidence ? `${Math.round(row.confidence)}%` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

