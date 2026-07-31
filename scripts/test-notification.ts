import { prisma } from '../src/lib/db'

async function main() {
  const users = await prisma.user.findMany({ take: 1 })
  if (users.length === 0) {
    console.log("No users found to send notification to.")
    return
  }

  const user = users[0]

  const notif = await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Test Notification",
      message: "This is a real-time notification sent from the backend!",
      type: "INFO",
      link: "/"
    }
  })

  console.log("Created notification:", notif)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
