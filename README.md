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
- JWT tabanlı kimlik doğrulama, çoklu kullanıcı desteği

## Çalıştırma

```bash
npm install
# DB için ortam değişkenini ayarla: apps/api/.env -> DATABASE_URL
npm run prisma:migrate -w apps/api -- --name init
npm run prisma:generate -w apps/api
npm run dev:web
npm run dev:api
# İsteğe bağlı PDF servisi
npm run dev:parser
```

> Node.js (>=18), PostgreSQL (>=14) ve Python 3.11 ortamlarıyla test edildi.

### Varsayılan Demo Kullanıcısı

- **E-posta:** `demo@finance.local`
- **Şifre:** `demo123`

İsterseniz `/auth/register` ile yeni kullanıcı oluşturabilir, token'ı frontend'de kullanabilirsiniz.
