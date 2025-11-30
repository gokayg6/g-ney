import { NextRequest, NextResponse } from 'next/server';
import { getData, saveData, PortfolioData } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

// Force dynamic rendering - disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const data = getData();
    const section = params.section;
    const timestamp = Date.now();
    
    // Special handling for array sections
    if (section === 'social' || section === 'subdomainProjects') {
      return NextResponse.json((data as any)[section] || [], {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': timestamp.toString(),
          'X-Content-Version': timestamp.toString(),
        },
      });
    }
    
    const sectionKey = section as keyof PortfolioData;
    if (!(sectionKey in data)) {
      return NextResponse.json(
        { error: 'Section not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    return NextResponse.json(data[sectionKey], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Timestamp': timestamp.toString(),
        'X-Content-Version': timestamp.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const hostname = request.headers.get('host') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    const isLoegsDomain = hostname.includes('loegs.com') || hostname === 'loegs.com';
    
    console.log('PUT request received:', { 
      section: params.section, 
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

    const data = getData();
    const section = params.section as keyof PortfolioData;
    const sectionData = await request.json();

    // Special handling for array sections
    if (section === 'social' || section === 'subdomainProjects') {
      if (!Array.isArray(sectionData)) {
        return NextResponse.json(
          { error: `${section} section must be an array` },
          { status: 400 }
        );
      }
      (data as any)[section] = sectionData;
    } else {
      if (!(section in data)) {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }
      (data as any)[section] = sectionData;
    }

    saveData(data);
    console.log('Data saved successfully for section:', section);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving section:', error);
    return NextResponse.json(
      { error: `Failed to save section: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

