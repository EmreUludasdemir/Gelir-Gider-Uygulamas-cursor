"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchNotificationSettings,
  setAuthToken,
  updateNotificationSettings
} from "../../../lib/api";
import { useAuthStore } from "../../../store/useAuthStore";

type Settings = {
  emailSubscriptionReminders: boolean;
  emailBudgetAlerts: boolean;
};

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { token, initialize, isHydrated } = useAuthStore();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (isHydrated && !token) {
      router.replace("/login");
    }
  }, [isHydrated, token, router]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchNotificationSettings();
        setSettings({
          emailSubscriptionReminders: data.emailSubscriptionReminders,
          emailBudgetAlerts: data.emailBudgetAlerts
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Bildirim ayarları yüklenemedi"
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [token]);

  const handleToggle = (key: keyof Settings) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      await updateNotificationSettings(settings);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bildirim ayarları kaydedilemedi"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <main className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Ayarlar
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Bildirim Tercihleri
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hangi bildirimleri almak istediğini buradan yönetebilirsin.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loading && (
            <p className="text-sm text-slate-500">Ayarlar yükleniyor...</p>
          )}
          {error && (
            <p className="mb-3 text-sm font-medium text-rose-500">{error}</p>
          )}
          {settings && (
            <div className="space-y-4">
              <ToggleRow
                label="Abonelik hatırlatmaları"
                description="Yaklaşan abonelik ödemeleri için e-posta al."
                checked={settings.emailSubscriptionReminders}
                onChange={() => handleToggle("emailSubscriptionReminders")}
              />
              <ToggleRow
                label="Bütçe aşım uyarıları"
                description="Kategori bütçesini aştığında uyarı al."
                checked={settings.emailBudgetAlerts}
                onChange={() => handleToggle("emailBudgetAlerts")}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full border transition ${
          checked
            ? "border-emerald-500 bg-emerald-500"
            : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}


