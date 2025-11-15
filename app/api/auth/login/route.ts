import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, generateToken } from '@/lib/auth';

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

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('Login successful, token set');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}


