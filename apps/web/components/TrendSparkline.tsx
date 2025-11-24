"use client";

type Props = {
  data: number[];
  label: string;
};

export function TrendSparkline({ data, label }: Props) {
  const max = Math.max(...data, 1);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-4 flex items-end gap-2">
        {data.map((value, index) => {
          const height = (value / max) * 80 + 10;
          return (
            <div key={index} className="flex flex-1 flex-col items-center">
              <div
                className="w-full rounded-t-full bg-brand-500 transition-all"
                style={{ height }}
              />
              <span className="mt-2 text-xs text-slate-500">
                W{index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

