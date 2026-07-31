import { prisma } from '../src/lib/db'

async function main() {
  console.log("Setting up Supabase Storage Bucket...")

  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('project_briefs', 'project_briefs', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `)
    console.log("✅ Bucket 'project_briefs' created or updated.")

    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Public Access project_briefs" ON storage.objects;
      CREATE POLICY "Public Access project_briefs" ON storage.objects FOR SELECT USING ( bucket_id = 'project_briefs' );
    `)
    console.log("✅ Policy 'Public Access' created.")

    await prisma.$executeRawUnsafe(`
      DROP POLICY IF EXISTS "Auth Insert project_briefs" ON storage.objects;
      CREATE POLICY "Auth Insert project_briefs" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'project_briefs' AND auth.role() = 'authenticated' );
    `)
    console.log("✅ Policy 'Auth Insert' created.")

  } catch (error) {
    console.error("❌ Error setting up storage:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
