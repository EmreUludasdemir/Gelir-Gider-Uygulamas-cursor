"use client";

import { TransactionSuggestion } from "../types/dashboard";

type Props = {
  suggestions?: TransactionSuggestion[];
  isLoading?: boolean;
};

export function SuggestionsList({ suggestions = [], isLoading }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Kategori Önerileri
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            {suggestions.length} işlem
          </h3>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Düşük güven
        </span>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        {isLoading && <p className="text-slate-400">Öneriler yükleniyor...</p>}
        {!isLoading &&
          suggestions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
            >
              <div>
                <p className="font-medium text-slate-900">{item.description}</p>
                <p className="text-xs text-slate-500">
                  Tutar:{" "}
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: item.currency
                  }).format(item.amount)}{" "}
                  • Tahmin: {item.detectedCategory ?? "Belirsiz"}
                </p>
              </div>
              <p className="text-xs font-semibold text-amber-600">
                %{item.confidence}
              </p>
            </div>
          ))}
        {!isLoading && !suggestions.length && (
          <p className="text-sm text-slate-500">
            Şu anda onay bekleyen işlem bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
}

