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
    const { payment_id, payment_request_id } = await req.json();

    const INSTAMOJO_API_KEY = Deno.env.get('INSTAMOJO_API_KEY');
    const INSTAMOJO_AUTH_TOKEN = Deno.env.get('INSTAMOJO_AUTH_TOKEN');

    if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN) {
      throw new Error('Instamojo credentials not configured');
    }

    // Verify payment status
    const INSTAMOJO_API_URL = `https://www.instamojo.com/api/1.1/payment-requests/${payment_request_id}/${payment_id}/`;

    console.log('Verifying Instamojo payment:', { payment_id, payment_request_id });

    const response = await fetch(INSTAMOJO_API_URL, {
      method: 'GET',
      headers: {
        'X-Api-Key': INSTAMOJO_API_KEY,
        'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
      },
    });

    const data = await response.json();
    console.log('Instamojo verification response:', JSON.stringify(data));

    if (!data.success) {
      throw new Error(data.message || 'Failed to verify payment');
    }

    const payment = data.payment_request;
    const isPaymentComplete = payment.payment && payment.payment.status === 'Credit';

    return new Response(JSON.stringify({
      success: true,
      verified: isPaymentComplete,
      payment_status: payment.payment?.status || 'Unknown',
      amount: payment.amount,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error verifying payment:', errorMessage);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      verified: false,
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
