type StatCardProps = {
  label: string;
  value: string;
  delta?: {
    value: string;
    direction: "up" | "down";
  };
};

export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {delta && (
        <p
          className={`mt-2 text-sm font-medium ${
            delta.direction === "up" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {delta.direction === "up" ? "▲" : "▼"} {delta.value}
        </p>
      )}
    </div>
  );
}

