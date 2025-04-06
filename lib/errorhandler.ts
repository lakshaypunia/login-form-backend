import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest, context: any) => Promise<NextResponse>;

export function ErrorHandler(handler: Handler) {
  return async (req: NextRequest, context: any) => {
    try {
      const response = await handler(req, context);

      // CORS Headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return response;
    } catch (err) {
      console.error('API Error:', err);
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error',
        },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }
  };
}