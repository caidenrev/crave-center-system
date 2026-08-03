const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();
prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";`)
  .then(() => console.log('Done'))
  .catch((e) => console.error(e))
  .finally(()=>prisma.$disconnect());
