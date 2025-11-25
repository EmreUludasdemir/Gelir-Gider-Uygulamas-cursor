"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register, setAuthToken } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { token, setAuth, initialize, isHydrated } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isHydrated && token) {
      router.replace("/dashboard");
    }
  }, [isHydrated, token, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload =
        mode === "login"
          ? await login({ email: form.email, password: form.password })
          : await register({
              email: form.email,
              password: form.password,
              name: form.name || undefined
            });
      setAuth(payload);
      setAuthToken(payload.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/10 p-8 text-white shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-wide text-brand-200">
          Gelir Gider Uygulaması
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          {mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
        </h1>
        <p className="mt-1 text-sm text-white/70">
          Demo kullanıcı: demo@finance.local / demo123
        </p>

        <div className="mt-6 flex gap-2 rounded-full bg-white/10 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${
              mode === "login" ? "bg-white text-slate-900" : "text-white/80"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${
              mode === "register" ? "bg-white text-slate-900" : "text-white/80"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label className="text-sm text-white/80">
              İsim
              <input
                className="mt-1 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40"
                placeholder="Adınız"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
          )}
          <label className="text-sm text-white/80">
            E-posta
            <input
              required
              type="email"
              className="mt-1 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40"
              placeholder="ornek@mail.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </label>
          <label className="text-sm text-white/80">
            Şifre
            <input
              required
              minLength={6}
              type="password"
              className="mt-1 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40"
              placeholder="•••••••"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </label>
          {error && (
            <p className="text-sm font-medium text-rose-200">{error}</p>
          )}
          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-full bg-white py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "İşleniyor..."
              : mode === "login"
              ? "Giriş Yap"
              : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
}


