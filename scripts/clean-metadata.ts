import 'dotenv/config'
import { Pool } from 'pg'

async function main() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })

  console.log("Cleaning raw_user_meta_data for admin@crave.com...")
  const res = await pool.query(
    "UPDATE auth.users SET raw_user_meta_data = $1 WHERE email = $2",
    [JSON.stringify({ full_name: 'Crave Admin' }), 'admin@crave.com']
  )

  console.log(`Update successful! Rows affected: ${res.rowCount}`)
  await pool.end()
}

main().catch(console.error)
