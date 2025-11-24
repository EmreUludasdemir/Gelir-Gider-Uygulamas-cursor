\"use client\";

import useSWR from \"swr\";
import { useMemo } from \"react\";
import { StatCard } from \"../../../components/StatCard\";
import { PdfUpload } from \"../../../components/PdfUpload\";
import { ManualTransactionForm } from \"../../../components/ManualTransactionForm\";
import {
  Transaction,
  TransactionTable
} from \"../../../components/TransactionTable\";
import {
  createManualTransaction,
  fetchSummary,
  fetchSuggestions,
  fetchTransactions,
  uploadPdf
} from \"../../../lib/api\";
import { SuggestionsList } from \"../../../components/SuggestionsList\";
import { TopCategoriesCard } from \"../../../components/TopCategoriesCard\";
import { RecurringPaymentsCard } from \"../../../components/RecurringPaymentsCard\";
import { TrendSparkline } from \"../../../components/TrendSparkline\";
import {
  DashboardSummary,
  TransactionSuggestion
} from \"../../../types/dashboard\";

const currencyFormatter = (value: number) =>
  new Intl.NumberFormat(\"tr-TR\", {
    style: \"currency\",
    currency: \"TRY\"
  }).format(value);

export default function DashboardPage() {
  const {
    data: transactions,
    isLoading: transactionsLoading,
    mutate: mutateTransactions
  } = useSWR<Transaction[]>(\"transactions\", () =>
    fetchTransactions()
  );
  const {
    data: summary,
    isLoading: summaryLoading,
    mutate: mutateSummary
  } = useSWR<DashboardSummary>(\"summary\", fetchSummary);
  const {
    data: suggestions,
    isLoading: suggestionsLoading,
    mutate: mutateSuggestions
  } = useSWR<TransactionSuggestion[]>(\"suggestions\", fetchSuggestions);

  const latestTransactions = transactions?.slice(0, 6);

  const weeklyTrend = useMemo(() => {
    if (!transactions) {
      return [8, 12, 10, 15];
    }
    const buckets = [0, 0, 0, 0];
    transactions.forEach((tx) => {
      if (tx.type !== \"expense\") return;
      const dayDiff =
        (Date.now() - new Date(tx.date).getTime()) / (1000 * 60 * 60 * 24);
      const bucketIndex = Math.min(3, Math.floor(dayDiff / 7));
      buckets[3 - bucketIndex] += Math.abs(tx.amount);
    });
    return buckets.map((value) => Number(value.toFixed(0)));
  }, [transactions]);

  const refreshAll = async () => {
    await Promise.all([
      mutateTransactions(),
      mutateSummary(),
      mutateSuggestions()
    ]);
  };

  return (
    <div className=\"min-h-screen bg-slate-50 px-4 py-8\">
      <header className=\"mx-auto max-w-6xl pb-6\">
        <p className=\"text-sm uppercase tracking-wide text-slate-500\">
          Hoş geldin Emre
        </p>
        <h1 className=\"text-3xl font-semibold text-slate-900\">
          Finans Dashboard
        </h1>
        <p className=\"text-sm text-slate-500\">
          {summary?.month ?? \"Veri getiriliyor...\"}
        </p>
      </header>

      <section className=\"mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4\">
        <StatCard
          label={`${summary?.month ?? \"Bu Ay\"} Gelir`}
          value={summary ? currencyFormatter(summary.totalIncome) : \"-\"}
          delta={{ value: \"%12\", direction: \"up\" }}
        />
        <StatCard
          label={`${summary?.month ?? \"Bu Ay\"} Gider`}
          value={summary ? currencyFormatter(summary.totalExpense) : \"-\"}
          delta={{ value: \"%5\", direction: \"down\" }}
        />
        <StatCard
          label=\"Net Bakiye\"
          value={summary ? currencyFormatter(summary.balance) : \"-\"}
          delta={{
            value: `${summary?.changePercentage ?? 0}%`,
            direction: summary && summary.balance >= 0 ? \"up\" : \"down\"
          }}
        />
        <StatCard
          label=\"Öneri Kuyruğu\"
          value={`${suggestions?.length ?? 0} işlem`}
        />
      </section>

      <section className=\"mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-3\">
        <PdfUpload
          onUpload={async (file) => {
            const formData = new FormData();
            formData.append(\"file\", file);
            await uploadPdf(formData);
            await refreshAll();
          }}
        />
        <ManualTransactionForm
          onSubmit={async (payload) => {
            await createManualTransaction(payload);
            await refreshAll();
          }}
        />
        <TrendSparkline data={weeklyTrend} label=\"Haftalık Gider Trend\" />
      </section>

      <section className=\"mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-3\">
        <TopCategoriesCard
          items={summary?.topCategories ?? []}
          totalExpense={summary?.totalExpense ?? 1}
        />
        <RecurringPaymentsCard items={summary?.recurringPayments ?? []} />
        <SuggestionsList
          suggestions={suggestions}
          isLoading={suggestionsLoading}
        />
      </section>

      <section className=\"mx-auto mt-8 max-w-6xl space-y-4\">
        <div>
          <p className=\"text-sm uppercase tracking-wide text-slate-500\">
            Son İşlemler
          </p>
          <h2 className=\"text-2xl font-semibold text-slate-900\">
            Kategori önerisi bekleyenler
          </h2>
        </div>
        <TransactionTable
          transactions={latestTransactions}
          isLoading={transactionsLoading}
        />
      </section>
    </div>
  );
}

