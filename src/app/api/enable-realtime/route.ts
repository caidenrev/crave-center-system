import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";`);
    return NextResponse.json({ success: true, message: 'Realtime enabled for Notification table' });
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      return NextResponse.json({ success: true, message: 'Realtime already enabled' });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
