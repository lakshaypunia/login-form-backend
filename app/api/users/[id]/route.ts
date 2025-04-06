import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // make sure you have this
import { ErrorHandler } from '@/lib/errorhandler';

export const GET = ErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user }, { status: 200 });
});

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}




