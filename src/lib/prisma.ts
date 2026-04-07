import { PrismaClient } from "@prisma/client";
import { PrismaPg as PrismaPgAdapter } from "@prisma/adapter-pg";


const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prismaClientOptions: any = {
  log: ["warn", "error"],
};

if (process.env.PRISMA_CLIENT_ADAPTER) {
  if (process.env.PRISMA_CLIENT_ADAPTER === "@prisma/adapter-pg") {
    prismaClientOptions.adapter = new PrismaPgAdapter(process.env.DATABASE_URL);
  } else {
    prismaClientOptions.adapter = process.env.PRISMA_CLIENT_ADAPTER as any;
  }
} else if (process.env.PRISMA_CLIENT_ACCELERATE_URL) {
  prismaClientOptions.accelerateUrl = process.env.PRISMA_CLIENT_ACCELERATE_URL;
} else if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL.toLowerCase();
    if (url.startsWith("postgres:") || url.startsWith("postgresql:") || url.includes("postgres")) {
      prismaClientOptions.adapter = new PrismaPgAdapter(process.env.DATABASE_URL);
    }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
