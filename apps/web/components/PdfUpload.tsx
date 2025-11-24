"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

type Props = {
  onUpload: (file: File) => Promise<void>;
};

export function PdfUpload({ onUpload }: Props) {
  const [isUploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setMessage(null);
      await onUpload(file);
      setMessage("PDF kuyruğa alındı.");
    } catch (error) {
      console.error(error);
      setMessage("Yükleme sırasında hata oluştu.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center shadow-inner">
      <Upload className="mx-auto h-10 w-10 text-brand-500" />
      <p className="mt-3 text-lg font-semibold text-slate-900">
        Banka PDF&apos;i yükle
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Çoklu banka/kart destekli. Satır bazında işlem çıkarımı yapılır.
      </p>
      <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
        {isUploading ? "Gönderiliyor..." : "PDF seç"}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
          disabled={isUploading}
        />
      </label>
      {message && (
        <p className="mt-3 text-sm font-medium text-emerald-600">{message}</p>
      )}
    </div>
  );
}

