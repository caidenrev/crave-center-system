import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log("Setting up Supabase Auth Trigger...")

  try {
    // Create or replace the function
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public."User" (id, name, email, role, "updatedAt")
        VALUES (
          new.id,
          COALESCE(new.raw_user_meta_data->>'full_name', new.email),
          new.email,
          'CLIENT',
          now()
        );
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `)
    console.log("✅ Function handle_new_user created successfully.")

    // Drop trigger if exists to prevent errors, then create it
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `)
    console.log("✅ Trigger on_auth_user_created created successfully on auth.users.")

  } catch (error) {
    console.error("❌ Error setting up trigger:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
