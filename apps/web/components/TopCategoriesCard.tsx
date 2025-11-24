"use client";

type Category = {
  category: string;
  total: number;
  percentage: number;
};

type Props = {
  items: Category[];
  totalExpense: number;
};

export function TopCategoriesCard({ items, totalExpense }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        En Çok Harcama Yapılan Kategoriler
      </p>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>{item.category}</span>
              <span>
                ₺{item.total.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Toplamın %{item.percentage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

