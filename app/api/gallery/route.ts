import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      const files = await readdir(uploadsDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );
      
      const images = imageFiles.map(file => `/uploads/${file}`);
      
      return NextResponse.json({ images }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    } catch (error) {
      // If uploads directory doesn't exist, return empty array
      return NextResponse.json({ images: [] });
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

