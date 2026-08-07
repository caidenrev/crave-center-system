import 'dotenv/config'
import { prisma } from '../src/lib/db'

async function main() {
  console.log("--- Supabase Auth Users ---")
  const authUsers: any = await prisma.$queryRawUnsafe(`
    SELECT id, email, email_confirmed_at, created_at, raw_user_meta_data
    FROM auth.users
  `)
  console.log(authUsers)

  console.log("--- Prisma Public Users ---")
  const publicUsers = await prisma.user.findMany()
  console.log(publicUsers)
}

main().finally(() => prisma.$disconnect())
