import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ErrorHandler } from '@/lib/errorhandler';

async function handler(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const isPasswordValid = password === user.password;
    if (isPasswordValid) {
      return NextResponse.json({
        success: true,
        message: 'Logged in successfully.',
        user,
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Either username or password is incorrect.',
      }, { status: 201 });
    }
  }

  return NextResponse.json({
    success: false,
    message: 'Either username or password is incorrect.',
  }, { status: 201 });
}

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

export const POST = ErrorHandler(handler);
