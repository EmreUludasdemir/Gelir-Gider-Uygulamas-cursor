# Gelir Gider Uygulaması

PDF ekstreleri ve manuel girişlerle finansal hareketleri takip eden modern monorepo.

## Paketler
- `apps/web`: Next.js 14 + TypeScript + Tailwind ile dashboard, öneri kuyruğu, abonelik kartları
- `apps/api`: NestJS tabanlı REST API, işlem özeti ve sınıflandırma uçları
- `services/pdf-parser`: FastAPI + pdfminer.six ile PDF satır çıkarımı

## Öne Çıkanlar
- Haftalık gider trendi, kategori bazlı grafikleri ve yaklaşan abonelik kartları
- Düşük güvenli satırlar için öneri kuyruğu
- PDF yükleme kuyruğu, manuel işlem formu (para birimi ve tür seçimi)
- `/transactions/summary` ile gelir/gider dengesi ve üst kategoriler
- `/transactions/suggestions` ile kategori öneri kuyruğu

## Çalıştırma

```bash
npm install
npm run dev:web
npm run dev:api
# İsteğe bağlı PDF servisi
npm run dev:parser
```

> Node.js (>=18) ve Python 3.11 ortamlarıyla test edildi.
