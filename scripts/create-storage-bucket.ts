import 'dotenv/config'
import { Pool } from 'pg'

async function main() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })

  console.log("Setting up Supabase Storage 'avatars' bucket...")

  // 1. Create bucket in storage.buckets
  await pool.query(`
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
    VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']) 
    ON CONFLICT (id) DO UPDATE SET public = true;
  `)
  console.log("Bucket 'avatars' created or ensured public!")

  // 2. Add storage policies for public read and authenticated insert/update
  try {
    await pool.query(`
      CREATE POLICY "Public Avatars Select" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');
    `)
  } catch (e: any) {
    console.log("Select policy info:", e.message)
  }

  try {
    await pool.query(`
      CREATE POLICY "Public Avatars Insert" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'avatars');
    `)
  } catch (e: any) {
    console.log("Insert policy info:", e.message)
  }

  try {
    await pool.query(`
      CREATE POLICY "Public Avatars Update" ON storage.objects
      FOR UPDATE USING (bucket_id = 'avatars');
    `)
  } catch (e: any) {
    console.log("Update policy info:", e.message)
  }

  console.log("Storage setup complete!")
  await pool.end()
}

main().catch(console.error)
