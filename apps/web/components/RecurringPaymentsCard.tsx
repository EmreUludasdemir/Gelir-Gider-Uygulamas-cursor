"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";

type Recurring = {
  id: string;
  description: string;
  amount: number;
  nextDate: string;
  category: string;
};

type Props = {
  items: Recurring[];
};

export function RecurringPaymentsCard({ items }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        Yaklaşan Abonelikler
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.description}</p>
              <p className="text-xs text-slate-500">
                {item.category} •{" "}
                {format(new Date(item.nextDate), "d MMM yyyy", { locale: tr })}
              </p>
            </div>
            <p className="text-sm font-semibold text-brand-600">
              ₺{item.amount.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

