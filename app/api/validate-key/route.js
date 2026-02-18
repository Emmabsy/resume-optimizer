import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { licenseKey } = await request.json();

    if (!licenseKey || licenseKey.length < 10) {
      return Response.json(
        { error: 'Invalid license key format' },
        { status: 400 }
      );
    }

    // Look up the key
    const { data, error } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', licenseKey.trim().toUpperCase())
      .single();

    if (error || !data) {
      return Response.json(
        { error: 'License key not found. Check your purchase email or contact support.' },
        { status: 404 }
      );
    }

    // Check if credits remain
    if (data.credits_remaining <= 0) {
      return Response.json(
        { 
          error: 'No credits remaining. Purchase more at [your-gumroad-link]',
          creditsRemaining: 0,
          totalCredits: data.total_credits
        },
        { status: 403 }
      );
    }

    return Response.json({
      valid: true,
      creditsRemaining: data.credits_remaining,
      totalCredits: data.total_credits,
      email: data.email
    });

  } catch (error) {
    console.error('Validation error:', error);
    return Response.json(
      { error: 'Failed to validate license key' },
      { status: 500 }
    );
  }
}