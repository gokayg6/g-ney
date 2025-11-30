import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Get hostname to determine domain
  const hostname = request.headers.get('host') || '';
  const isProduction = process.env.NODE_ENV === 'production';
  const isLoegsDomain = hostname.includes('loegs.com') || hostname === 'loegs.com';
  
  const cookieOptions: any = {
    path: '/',
  };
  
  // Set domain for production on loegs.com
  if (isProduction && isLoegsDomain) {
    cookieOptions.domain = '.loegs.com';
  }
  
  response.cookies.set('admin-token', '', {
    ...cookieOptions,
    maxAge: 0,
  });
  
  return response;
}


