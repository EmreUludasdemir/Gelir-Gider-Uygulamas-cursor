import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Prisma, TransactionType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const DEMO_EMAIL = "demo@finance.local";
const DEMO_PASSWORD = "demo123";

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async onModuleInit() {
    const existing = await this.usersService.findByEmail(DEMO_EMAIL);
    if (!existing) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
      const demoUser = await this.usersService.create({
        email: DEMO_EMAIL,
        passwordHash,
        name: "Demo Kullanıcı"
      });
      await this.seedInitialData(demoUser.id);
      // eslint-disable-next-line no-console
      console.log(
        `Demo kullanıcı hazır: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`
      );
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("E-posta zaten kayıtlı");
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      name: dto.name
    });
    await this.seedInitialData(user.id);
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Geçersiz kimlik bilgileri");
    }
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException("Geçersiz kimlik bilgileri");
    }
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: { id: string; email: string; name?: string }) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? user.email.split("@")[0]
      }
    };
  }

  private async seedInitialData(userId: string) {
    const account = await this.prisma.account.create({
      data: {
        userId,
        name: "Varsayılan Hesap",
        provider: "manual",
        type: "offline",
        currency: "TRY"
      }
    });

    const categories = [
      { name: "Abonelik", type: TransactionType.EXPENSE, id: undefined },
      { name: "Market", type: TransactionType.EXPENSE, id: undefined },
      { name: "Gelir", type: TransactionType.INCOME, id: undefined }
    ];

    const createdCategories = await Promise.all(
      categories.map((cat) =>
        this.prisma.category.create({
          data: {
            name: cat.name,
            type: cat.type,
            userId
          }
        })
      )
    );

    const categoryMap = Object.fromEntries(
      createdCategories.map((cat) => [cat.name, cat.id])
    );

    const today = new Date();
    const sampleTransactions: Prisma.TransactionCreateInput[] = [
      {
        user: { connect: { id: userId } },
        account: { connect: { id: account.id } },
        category: { connect: { id: categoryMap["Abonelik"] } },
        description: "Spotify",
        amount: new Prisma.Decimal(-89.99),
        currency: "TRY",
        source: "PDF",
        type: TransactionType.EXPENSE,
        confidence: 98,
        occurredAt: today
      },
      {
        user: { connect: { id: userId } },
        account: { connect: { id: account.id } },
        category: { connect: { id: categoryMap["Market"] } },
        description: "Migros Online",
        amount: new Prisma.Decimal(-540.45),
        currency: "TRY",
        source: "PDF",
        type: TransactionType.EXPENSE,
        confidence: 72,
        occurredAt: new Date(today.getTime() - 86400000)
      },
      {
        user: { connect: { id: userId } },
        account: { connect: { id: account.id } },
        category: { connect: { id: categoryMap["Gelir"] } },
        description: "Serbest Çalışma Ödemesi",
        amount: new Prisma.Decimal(15000),
        currency: "TRY",
        source: "MANUAL",
        type: TransactionType.INCOME,
        confidence: 100,
        occurredAt: new Date(today.getTime() - 86400000 * 2)
      }
    ];

    await this.prisma.$transaction(
      sampleTransactions.map((tx) => this.prisma.transaction.create({ data: tx }))
    );
  }
}

