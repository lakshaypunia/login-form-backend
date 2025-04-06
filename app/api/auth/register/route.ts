import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ErrorHandler } from '@/lib/errorhandler';



async function handler(req: NextRequest) {
  const body = await req.json();
  const { email, password, fullName, phoneNumber, companyName, isAgency, profilePicture } = body;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const isPasswordValid = password === existingUser.password;
    if (isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'User already exists with the entered email. Use a new email or sign in.',
        user: existingUser,
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Login failed. Username exists but password is incorrect.',
      }, { status: 201 });
    }
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      password,
      fullName,
      phoneNumber,
      companyName,
      isAgency,
      profilePicture,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'New user created successfully.',
    user: newUser,
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
