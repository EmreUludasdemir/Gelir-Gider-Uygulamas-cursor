const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function toQueryString(params: Record<string, string | undefined>) {
  const query = Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join("&");
  return query ? `?${query}` : "";
}

export async function uploadPdf(formData: FormData) {
  const response = await fetch(`${API_BASE}/uploads/pdf`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error("PDF yükleme başarısız.");
  }
  return response.json();
}

export async function createManualTransaction(payload: {
  description: string;
  amount: number;
  date: string;
  categoryLabel: string;
  categoryId?: string;
  type: "income" | "expense";
}) {
  const response = await fetch(`${API_BASE}/transactions/manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error("İşlem kaydedilemedi.");
  }
  return response.json();
}

export async function fetchTransactions(params: {
  categoryId?: string;
  type?: "income" | "expense";
  source?: "pdf" | "manual";
  dateFrom?: string;
  dateTo?: string;
} = {}) {
  const query = toQueryString(params);
  const response = await fetch(`${API_BASE}/transactions${query}`);
  if (!response.ok) {
    throw new Error("İşlemler getirilemedi.");
  }
  return response.json();
}

export async function fetchSummary() {
  const response = await fetch(`${API_BASE}/transactions/summary`, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    throw new Error("Özet getirilemedi.");
  }
  return response.json();
}

export async function fetchSuggestions() {
  const response = await fetch(`${API_BASE}/transactions/suggestions`);
  if (!response.ok) {
    throw new Error("Öneriler getirilemedi.");
  }
  return response.json();
}
