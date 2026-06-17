import { PrismaClient } from '@prisma/client'

// ─── Prisma Client Singleton (Saka legacy path) ───
// Re-export dari core/lib/db untuk konsistensi.
// Sekarang kedua path (@/lib/prisma dan @/core/lib/db) share instance yang sama.

export { db } from '@/core/lib/db'
