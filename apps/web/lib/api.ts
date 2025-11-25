const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function toQueryString(params: Record<string, string | undefined>) {
  const query = Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join("&");
  return query ? `?${query}` : "";
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers ?? {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  }
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "API hatası");
  }
  return response.json();
}

export function uploadPdf(formData: FormData) {
  return apiFetch("/uploads/pdf", {
    method: "POST",
    body: formData
  });
}

export function createManualTransaction(payload: {
  description: string;
  amount: number;
  date: string;
  categoryLabel: string;
  categoryId?: string;
  type: "income" | "expense";
}) {
  return apiFetch("/transactions/manual", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchTransactions(params: {
  categoryId?: string;
  type?: "income" | "expense";
  source?: "pdf" | "manual";
  dateFrom?: string;
  dateTo?: string;
} = {}) {
  const query = toQueryString(params);
  return apiFetch(`/transactions${query}`);
}

export function fetchSummary() {
  return apiFetch("/transactions/summary");
}

export function fetchSuggestions() {
  return apiFetch("/transactions/suggestions");
}

export function login(payload: { email: string; password: string }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload: {
  email: string;
  password: string;
  name?: string;
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchCategories() {
  return apiFetch("/categories");
}

export function createCategory(payload: {
  name: string;
  type: "income" | "expense";
  color?: string;
}) {
  return apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteCategory(id: string) {
  return apiFetch(`/categories/${id}`, {
    method: "DELETE"
  });
}

export function fetchBudgets() {
  return apiFetch("/budgets");
}

export function createBudget(payload: {
  categoryId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
}) {
  return apiFetch("/budgets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function assignTransactionCategory(payload: {
  transactionId: string;
  categoryId: string;
}) {
  return apiFetch(`/transactions/${payload.transactionId}/category`, {
    method: "PATCH",
    body: JSON.stringify({ categoryId: payload.categoryId })
  });
}

export function rejectSuggestion(transactionId: string) {
  return apiFetch(`/transactions/${transactionId}/reject`, {
    method: "POST"
  });
}

export function fetchNotificationSettings() {
  return apiFetch("/notification-settings");
}

export function updateNotificationSettings(payload: {
  emailSubscriptionReminders?: boolean;
  emailBudgetAlerts?: boolean;
}) {
  return apiFetch("/notification-settings", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
