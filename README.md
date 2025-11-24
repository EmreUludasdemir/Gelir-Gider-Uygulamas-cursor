# Gelir Gider Uygulaması

Monorepo yaklaşımıyla hazırlanmış kişisel finans yönetim uygulaması.

- `apps/web`: Next.js + TypeScript + Tailwind CSS tabanlı web arayüzü
- `apps/api`: NestJS (Express) tabanlı REST API
- `services/pdf-parser`: PDF dosyalarından işlem çıkarımı yapan Python servisi

## Çalıştırma

```
npm install
npm run dev:web
npm run dev:api
npm run dev:parser
```

> Node.js ve Python bağımlılıkları kurulu olmalıdır.

