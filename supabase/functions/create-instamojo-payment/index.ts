import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { purpose, amount, buyer_name, email, phone, redirect_url } = await req.json();

    const INSTAMOJO_API_KEY = Deno.env.get('INSTAMOJO_API_KEY');
    const INSTAMOJO_AUTH_TOKEN = Deno.env.get('INSTAMOJO_AUTH_TOKEN');

    if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN) {
      throw new Error('Instamojo credentials not configured');
    }

    // Production Instamojo API endpoint
    const INSTAMOJO_API_URL = 'https://www.instamojo.com/api/1.1/payment-requests/';

    const formData = new URLSearchParams();
    formData.append('purpose', purpose || 'AI Report Download');
    formData.append('amount', amount || '50');
    formData.append('buyer_name', buyer_name || 'Customer');
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('redirect_url', redirect_url);
    formData.append('send_email', 'false');
    formData.append('send_sms', 'false');
    formData.append('allow_repeated_payments', 'false');

    console.log('Creating Instamojo payment request...');

    const response = await fetch(INSTAMOJO_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': INSTAMOJO_API_KEY,
        'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    console.log('Instamojo response:', JSON.stringify(data));

    if (!data.success) {
      throw new Error(data.message || 'Failed to create payment request');
    }

    return new Response(JSON.stringify({
      success: true,
      payment_request: data.payment_request,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating payment:', errorMessage);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
