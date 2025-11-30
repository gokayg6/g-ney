import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, generateToken, getCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Trim whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log('Login attempt:', { email: trimmedEmail, hasPassword: !!trimmedPassword });
    console.log('Expected email:', process.env.ADMIN_EMAIL);
    console.log('Expected password set:', !!process.env.ADMIN_PASSWORD);

    const isValid = await authenticateAdmin(trimmedEmail, trimmedPassword);

    console.log('Authentication result:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    const token = generateToken(trimmedEmail);

    // Get hostname from request to determine domain
    const hostname = request.headers.get('host') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    const isLoegsDomain = hostname.includes('loegs.com') || hostname === 'loegs.com';

    const cookieOptions: any = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    // Set domain for production on loegs.com
    if (isProduction && isLoegsDomain) {
      cookieOptions.domain = '.loegs.com'; // Use .loegs.com for subdomain support
    }

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('admin-token', token, cookieOptions);

    console.log('Login successful, token set', { domain: cookieOptions.domain, secure: cookieOptions.secure });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}


