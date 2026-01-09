import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentDetails {
  purpose: string;
  amount: string;
  buyer_name: string;
  email: string;
  phone: string;
}

export const useInstamojoPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const initiatePayment = async (details: PaymentDetails) => {
    setIsProcessing(true);
    
    try {
      // Create redirect URL for payment completion
      const redirectUrl = `${window.location.origin}/create?payment=success`;

      const { data, error } = await supabase.functions.invoke('create-instamojo-payment', {
        body: {
          ...details,
          redirect_url: redirectUrl,
        },
      });

      if (error) throw error;

      if (data.success && data.payment_request) {
        // Store payment request ID in sessionStorage for verification
        sessionStorage.setItem('payment_request_id', data.payment_request.id);
        
        // Redirect to Instamojo payment page
        window.location.href = data.payment_request.longurl;
      } else {
        throw new Error(data.error || 'Failed to create payment');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (paymentId: string, paymentRequestId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-instamojo-payment', {
        body: {
          payment_id: paymentId,
          payment_request_id: paymentRequestId,
        },
      });

      if (error) throw error;

      if (data.success && data.verified) {
        setPaymentComplete(true);
        sessionStorage.setItem('payment_verified', 'true');
        toast.success('Payment successful! You can now download your report.');
        return true;
      } else {
        toast.error('Payment verification failed. Please contact support.');
        return false;
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
      return false;
    }
  };

  const checkPaymentStatus = () => {
    return sessionStorage.getItem('payment_verified') === 'true';
  };

  const clearPaymentStatus = () => {
    sessionStorage.removeItem('payment_verified');
    sessionStorage.removeItem('payment_request_id');
    setPaymentComplete(false);
  };

  return {
    isProcessing,
    paymentComplete,
    initiatePayment,
    verifyPayment,
    checkPaymentStatus,
    clearPaymentStatus,
  };
};
