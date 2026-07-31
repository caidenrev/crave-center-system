import { Role } from '../src/generated/prisma'
import { prisma } from '../src/lib/db'

async function main() {
  console.log("Seeding Dummy Workers...")

  const workers = [
    {
      name: "Alex IT Expert",
      email: "alex@crave.com",
      role: Role.TEAM_MEMBER,
      category: "IT",
      skills: ["React", "Next.js", "Node.js", "PostgreSQL"],
      rating: 4.8,
      totalReviews: 24
    },
    {
      name: "Budi Backend",
      email: "budi@crave.com",
      role: Role.TEAM_MEMBER,
      category: "IT",
      skills: ["Python", "Django", "AWS", "API Design"],
      rating: 4.5,
      totalReviews: 15
    },
    {
      name: "Citra Designer",
      email: "citra@crave.com",
      role: Role.TEAM_MEMBER,
      category: "NON_IT",
      skills: ["Figma", "UI/UX", "Illustration", "Branding"],
      rating: 4.9,
      totalReviews: 42
    },
    {
      name: "Dewi Data",
      email: "dewi@crave.com",
      role: Role.TEAM_MEMBER,
      category: "IT",
      skills: ["Data Analysis", "Machine Learning", "SQL", "Tableau"],
      rating: 4.7,
      totalReviews: 30
    }
  ]

  for (const w of workers) {
    const existing = await prisma.user.findUnique({ where: { email: w.email } })
    if (!existing) {
      await prisma.user.create({ data: w })
      console.log(`✅ Created worker ${w.name}`)
    } else {
      await prisma.user.update({
        where: { email: w.email },
        data: w
      })
      console.log(`✅ Updated worker ${w.name}`)
    }
  }

  console.log("Seeding finished.")
}

main().catch(console.error).finally(() => prisma.$disconnect())
