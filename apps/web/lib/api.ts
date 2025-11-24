const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
  category: string;
  type: string;
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

export async function fetchTransactions(query = "") {
  const response = await fetch(`${API_BASE}/transactions${query}`);
  if (!response.ok) {
    throw new Error("İşlemler getirilemedi.");
  }
  return response.json();
}

