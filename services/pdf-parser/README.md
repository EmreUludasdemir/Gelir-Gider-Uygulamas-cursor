# PDF Parser Servisi

FastAPI + pdfminer.six kullanarak banka PDF'lerinden satır bazında işlem çıkarır.

## Çalıştırma

```
cd services/pdf-parser
pip install -e .
uvicorn app.main:app --reload --port 8001
```

`POST /parse` endpoint'i `file` alanında PDF kabul edip normalize edilmiş işlemleri JSON olarak döndürür.

