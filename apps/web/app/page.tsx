"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-900 text-white">
      <p className="rounded-full border border-white/30 px-4 py-1 text-sm uppercase tracking-wide text-white/90">
        Gelir Gider Uygulaması
      </p>
      <h1 className="max-w-2xl text-center text-4xl font-semibold leading-tight">
        Banka PDF&apos;lerini yükle, işlemleri otomatik sınıflandır, finansını
        tek panelden yönet.
      </h1>
      <p className="max-w-xl text-center text-lg text-white/70">
        Next.js + NestJS + PostgreSQL mimarisi ile tasarlanmış modüler kişisel
        finans çözümü.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5"
      >
        Dashboard&apos;a Git
        <ArrowRight size={18} />
      </Link>
    </main>
  );
}

