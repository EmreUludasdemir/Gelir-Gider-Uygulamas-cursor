"use client";

type Filters = {
  type?: "income" | "expense";
  source?: "pdf" | "manual";
  dateFrom?: string;
  dateTo?: string;
};

type Props = {
  value: Filters;
  onChange: (filters: Filters) => void;
};

export function TransactionFilters({ value, onChange }: Props) {
  const update = (key: keyof Filters, val: string) => {
    onChange({
      ...value,
      [key]: val || undefined
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">Filtreler</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Tür
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.type ?? ""}
            onChange={(event) => update("type", event.target.value)}
          >
            <option value="">Tümü</option>
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
          </select>
        </label>
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Kaynak
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.source ?? ""}
            onChange={(event) => update("source", event.target.value)}
          >
            <option value="">Tümü</option>
            <option value="pdf">PDF</option>
            <option value="manual">Manuel</option>
          </select>
        </label>
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Başlangıç
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.dateFrom ?? ""}
            onChange={(event) => update("dateFrom", event.target.value)}
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Bitiş
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={value.dateTo ?? ""}
            onChange={(event) => update("dateTo", event.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

