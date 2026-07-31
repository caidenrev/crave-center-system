import { prisma } from '../src/lib/db'

async function main() {
  const users = await prisma.user.findMany()
  console.log("Users:")
  for (const u of users) {
    console.log(`- ${u.email} [${u.role}]`)
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
