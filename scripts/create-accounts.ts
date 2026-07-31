import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { Role } from '../src/generated/prisma'
import { prisma } from '../src/lib/db'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const accounts = [
    { email: 'worker@crave.com', password: 'password123', role: Role.TEAM_MEMBER, name: 'Crave Worker' },
    { email: 'admin@crave.com', password: 'password123', role: Role.ADMIN, name: 'Crave Admin' }
  ]

  for (const acc of accounts) {
    console.log(`Creating ${acc.email}...`)
    const { data, error } = await supabase.auth.signUp({
      email: acc.email,
      password: acc.password,
    })

    if (error) {
      console.error(`Supabase Error for ${acc.email}:`, error.message)
    } else {
      console.log(`Supabase User created: ${data.user?.id}`)
      
      // Upsert into Prisma just in case trigger fails or we want to force role
      try {
        await prisma.user.upsert({
          where: { email: acc.email },
          update: { role: acc.role, name: acc.name },
          create: {
            id: data.user!.id,
            email: acc.email,
            name: acc.name,
            role: acc.role
          }
        })
        console.log(`Prisma User synced for ${acc.email} with role ${acc.role}`)
      } catch (e: any) {
        console.error("Prisma error:", e.message)
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
