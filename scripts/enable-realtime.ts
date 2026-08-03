import { prisma } from '../src/lib/db'

async function main() {
  console.log('Enabling realtime for Notification table...')
  try {
    // This SQL enables realtime for the Notification table in Supabase
    await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";`)
    console.log('Successfully enabled realtime for Notification table.')
  } catch (error: any) {
    // If it's already added, it might throw an error, which we can ignore
    if (error.message?.includes('already exists')) {
      console.log('Table Notification is already in publication supabase_realtime.')
    } else {
      console.error('Error enabling realtime:', error)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
