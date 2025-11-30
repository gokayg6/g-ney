import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DOMAIN = process.env.DOMAIN || 'loegs.com';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Helper function to get cookie options for production
export function getCookieOptions() {
  const isProduction = NODE_ENV === 'production';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLoegsDomain = hostname.includes('loegs.com') || hostname === 'loegs.com';
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    ...(isProduction && isLoegsDomain && { domain: '.loegs.com' }), // Use .loegs.com for subdomain support
  };
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  // Trim and compare
  const trimmedEmail = email.trim().toLowerCase();
  const expectedEmail = ADMIN_EMAIL.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const expectedPassword = ADMIN_PASSWORD.trim();
  
  console.log('Auth attempt:', { 
    receivedEmail: trimmedEmail, 
    expectedEmail: expectedEmail,
    receivedPassword: trimmedPassword,
    expectedPassword: expectedPassword,
    emailMatch: trimmedEmail === expectedEmail,
    passwordMatch: trimmedPassword === expectedPassword
  });
  
  if (trimmedEmail !== expectedEmail) {
    console.log('Email mismatch:', { received: trimmedEmail, expected: expectedEmail });
    return false;
  }
  
  // Check plain text match (for initial setup)
  // In production, you should hash the password and store it, then compare hashes
  const passwordMatch = trimmedPassword === expectedPassword;
  if (!passwordMatch) {
    console.log('Password mismatch:', { received: trimmedPassword, expected: expectedPassword });
  }
  return passwordMatch;
}

export function getAdminCredentials() {
  return {
    email: ADMIN_EMAIL,
    // Don't return password
  };
}

