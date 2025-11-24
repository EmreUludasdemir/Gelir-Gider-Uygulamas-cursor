"use client";

import { useState } from "react";

type ManualTx = {
  description: string;
  amount: number;
  date: string;
  categoryLabel: string;
  currency: string;
  type: "income" | "expense";
};

type Props = {
  onSubmit: (tx: ManualTx) => Promise<void>;
};

export function ManualTransactionForm({ onSubmit }: Props) {
  const [form, setForm] = useState<ManualTx>({
    description: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    categoryLabel: "",
    currency: "TRY",
    type: "expense"
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await onSubmit(form);
      setStatus("İşlem kaydedildi.");
      setForm((prev) => ({
        ...prev,
        description: "",
        amount: 0,
        categoryLabel: ""
      }));
    } catch (error) {
      console.error(error);
      setStatus("Kaydederken hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-lg font-semibold text-slate-900">
        Manuel İşlem Ekle
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Açıklama
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            required
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Tutar
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            required
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Tarih
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            required
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Kategori
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            required
            name="categoryLabel"
            value={form.categoryLabel}
            onChange={handleChange}
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Para Birimi
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-600">
          Tür
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-brand-600 py-2 font-semibold text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
      </button>
      {status && (
        <p className="text-center text-sm font-medium text-emerald-600">
          {status}
        </p>
      )}
    </form>
  );
}

