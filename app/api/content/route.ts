import { NextRequest, NextResponse } from 'next/server';
import { getData, saveData, PortfolioData } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

// Force dynamic rendering - disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Add timestamp to response to prevent any caching
    const data = getData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Timestamp': Date.now().toString(),
        'X-Content-Version': Date.now().toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    const isLoegsDomain = hostname.includes('loegs.com') || hostname === 'loegs.com';
    
    console.log('PUT request received:', { 
      hostname, 
      isProduction, 
      isLoegsDomain 
    });

    // Verify authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json(
        { error: 'Unauthorized - No authentication token' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    console.log('Authentication successful:', { email: decoded.email });

    const data: PortfolioData = await request.json();
    saveData(data);
    console.log('Content saved successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: `Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

