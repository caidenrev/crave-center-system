import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const userId = "f894335c-fb83-432f-9110-31ebe4ea04f3"

  console.log(`Mencari data untuk user dengan ID: ${userId}...`)
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    console.log("User tidak ditemukan di database.")
    return
  }

  console.log(`User ditemukan: ${user.name} (${user.email})`)
  console.log("Menghapus data terkait...")

  // Hapus dari bawah ke atas sesuai relasi
  
  // 1. WorkerApplication
  await prisma.workerApplication.deleteMany({
    where: { userId }
  })
  
  // 2. Notifications (sudah cascade, tapi gapapa kita pastikan)
  await prisma.notification.deleteMany({
    where: { userId }
  })

  // 3. Messages (sebagai pengirim atau penerima)
  await prisma.message.deleteMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] }
  })

  // 4. Deliverables
  await prisma.deliverable.deleteMany({
    where: { uploadedById: userId }
  })

  // 5. Tasks
  await prisma.task.updateMany({
    where: { assigneeId: userId },
    data: { assigneeId: null }
  })

  // 6. Projects (sebagai worker, set null)
  await prisma.project.updateMany({
    where: { workerId: userId },
    data: { workerId: null }
  })
  
  // Catatan: Jika user ini adalah Client dari sebuah Project, kita tidak boleh 
  // menghapus projectnya sembarangan karena akan banyak error beruntun.
  const clientProjects = await prisma.project.findMany({
    where: { clientId: userId }
  })

  if (clientProjects.length > 0) {
    console.log(`\nPERHATIAN: User ini adalah Client dari ${clientProjects.length} project.`)
    console.log("Harap hapus atau transfer project tersebut terlebih dahulu.")
    return
  }

  // Jika aman, hapus user
  console.log("Data terkait berhasil diamankan, menghapus User...")
  await prisma.user.delete({
    where: { id: userId }
  })

  console.log("✅ User berhasil dihapus!")
}

main()
  .catch((e) => {
    console.error("Terjadi error:", e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
