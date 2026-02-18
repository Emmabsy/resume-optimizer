import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    // Get the form data from Gumroad
    const formData = await request.formData();
    
    // Extract the data
    const saleId = formData.get('sale_id');
    const productName = formData.get('product_name');
    const licenseKey = formData.get('license_key');
    const email = formData.get('email');
    const price = formData.get('price');
    
    console.log('Gumroad webhook received:', {
      saleId,
      productName,
      licenseKey,
      email,
      price
    });

    // Validate we have the required data
    if (!licenseKey) {
      console.error('No license key in webhook');
      return Response.json({ error: 'No license key' }, { status: 400 });
    }

    // Determine credits based on price
    let credits = 100; // Default for $19 purchase
    if (price && parseFloat(price) >= 50) {
      credits = 500; // Future: bulk purchase
    } else if (price && parseFloat(price) >= 30) {
      credits = 200; // Future: medium package
    }

    // Check if key already exists
    const { data: existing } = await supabase
      .from('license_keys')
      .select('license_key')
      .eq('license_key', licenseKey.toUpperCase())
      .single();

    if (existing) {
      console.log('License key already exists:', licenseKey);
      return Response.json({ message: 'Key already exists' });
    }

    // Add the license key to database
    const { data, error } = await supabase
      .from('license_keys')
      .insert([
        {
          license_key: licenseKey.toUpperCase(),
          credits_remaining: credits,
          total_credits: credits,
          email: email || null,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('License key added successfully:', licenseKey);

    return Response.json({ 
      success: true, 
      message: 'License key activated',
      key: licenseKey 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return Response.json({ 
    message: 'Gumroad webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}