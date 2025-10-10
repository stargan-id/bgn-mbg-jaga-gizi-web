import { NextRequest, NextResponse } from "next/server";
import { generateAutomaticAlertsAction } from "@/actions/peringatan";

/**
 * API route untuk generate peringatan otomatis
 * Endpoint ini akan dipanggil oleh scheduled job atau cron
 * 
 * Usage:
 * - GET /api/peringatan/generate-alerts
 * - Dapat dipanggil oleh external scheduler (GitHub Actions, Vercel Cron, dll)
 * - Atau internal scheduler menggunakan node-cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verifikasi authorization untuk keamanan
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate peringatan otomatis
    const result = await generateAutomaticAlertsAction();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      alertsGenerated: result.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in generate-alerts API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST method untuk manual trigger
 * Bisa dipanggil dari dashboard untuk testing
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add proper authentication check for admin users
    
    const result = await generateAutomaticAlertsAction();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Manual trigger successful. ${result.message}`,
      alertsGenerated: result.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in manual generate-alerts:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}