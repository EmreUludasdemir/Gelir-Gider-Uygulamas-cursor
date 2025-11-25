import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("App e2e", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/auth/login (POST) demo kullanici", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "demo@finance.local", password: "demo123" })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
  });
});


