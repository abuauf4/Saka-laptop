import { PrismaClient } from '@prisma/client'

// ─── Prisma Client Singleton ───
// Critical for Vercel serverless: cache Prisma client di globalThis
// supaya tidak create instance baru setiap cold start.
// Tanpa ini, connection pool PostgreSQL (Supabase/Neon, limit 15)
// cepat habis → API 500 "max clients reached".
//
// ALSO: user MUST set DATABASE_URL dengan pgBouncer params:
//   postgresql://...?pgBouncer=true&connection_limit=1
// Lihat README.md bagian "Production Deployment".

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Reuse existing instance kalau ada, kalau gak create baru
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

// WAJIB cache di globalThis untuk SEMUA environment (including production)
// supaya Vercel serverless function reuse instance antar invocations.
globalForPrisma.prisma = db
