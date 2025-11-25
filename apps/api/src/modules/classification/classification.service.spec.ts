import { ClassificationService } from "./classification.service";

describe("ClassificationService", () => {
  const service = new ClassificationService();

  it("Spotify için abonelik ve gider döndürür", () => {
    const result = service.classify("Spotify Aylık Üyelik", -49.99);
    expect(result.categoryLabel).toBe("Abonelik");
    expect(result.type).toBe("expense");
    expect(result.confidence).toBeGreaterThanOrEqual(90);
  });

  it("Pozitif tutarları gelir olarak etiketler", () => {
    const result = service.classify("Freelance ödeme", 1500);
    expect(result.type).toBe("income");
  });
});


