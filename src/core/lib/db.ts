import { PrismaClient } from '@prisma/client'

// ─── Prisma Client Singleton (Vercel serverless optimized) ───
// CRITICAL for Vercel serverless: cache Prisma client di globalThis
// supaya tidak create instance baru setiap cold start.
//
// Vercel + Supabase/Neon issue:
//   Each serverless function cold start creates new PrismaClient
//   → opens new DB connections → exhausts pool_size:15
//   → API 500 "max clients reached in session mode"
//
// Solution:
//   1. Cache instance in globalThis (reuse across invocations)
//   2. Use connection_limit=1 in DATABASE_URL (handled at URL level)
//   3. Use pgBouncer (handled at Supabase connection level)
//
// User MUST set DATABASE_URL dengan pgBouncer params:
//   postgresql://...?pgBouncer=true&connection_limit=1&pool_timeout=60
// Lihat README.md bagian "Production Deployment".

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create instance hanya kalau belum ada
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Connection limits di-handle via DATABASE_URL params (pgBouncer), bukan di sini
  })
}

export const db = globalForPrisma.prisma
