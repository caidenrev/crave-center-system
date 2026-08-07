import 'dotenv/config'
import { prisma } from '../src/lib/db'

async function main() {
  console.log("Confirming all unconfirmed email users in Supabase auth.users...")
  try {
    const result = await prisma.$executeRawUnsafe(`
      UPDATE auth.users
      SET email_confirmed_at = NOW()
      WHERE email_confirmed_at IS NULL;
    `)
    console.log(`✅ Successfully confirmed ${result} existing user(s)!`)
  } catch (error) {
    console.error("❌ Error confirming users via SQL:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
