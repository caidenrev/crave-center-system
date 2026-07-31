import { prisma } from '../src/lib/db'

async function main() {
  try {
    // This adds the Notification table to the existing supabase_realtime publication
    await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";`)
    console.log('Successfully added Notification to supabase_realtime publication.')
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('Notification is already in supabase_realtime publication.')
    } else {
      console.error('Error adding to publication:', error.message)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
