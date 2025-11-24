from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
import tempfile
from datetime import datetime
from typing import List

app = FastAPI(title="PDF Parser Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/parse")
async def parse_pdf(file: UploadFile = File(...)):
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="PDF dosyası bekleniyor")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Dosya boş")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp.flush()
        text = extract_text(tmp.name)

    entries = normalize_lines(text.splitlines())
    return {"transactions": entries, "total": len(entries)}


def normalize_lines(lines: List[str]):
    items = []
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        try:
            date_str, rest = line.split(" ", 1)
            parsed_date = datetime.strptime(date_str, "%d.%m.%Y").date()
        except ValueError:
            parsed_date = datetime.today().date()
            rest = line

        amount = extract_amount(rest)
        description = rest.replace(str(amount), "").strip()

        items.append(
            {
                "date": parsed_date.isoformat(),
                "description": description or "Bilinmeyen İşlem",
                "amount": amount,
                "currency": "TRY",
                "category": classify(description),
            }
        )
    return items


def extract_amount(text: str) -> float:
    tokens = text.replace(",", ".").split()
    for token in reversed(tokens):
        try:
            return float(token)
        except ValueError:
            continue
    return 0.0


def classify(description: str) -> str:
    desc = description.lower()
    if "spotify" in desc or "netflix" in desc:
        return "Abonelik"
    if "migros" in desc or "carrefour" in desc:
        return "Market"
    if "salary" in desc or "maaş" in desc:
        return "Gelir"
    return "Genel"

