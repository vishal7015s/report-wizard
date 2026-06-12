import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useReportStore } from '@/store/reportStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const useRazorpayPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const getProjectKey = useCallback(() => {
    const title = useReportStore.getState().reportData.projectDetails.projectTitle || '';
    return title ? `razorpay_payment_verified_${title.replace(/\s+/g, '_').toLowerCase()}` : '';
  }, []);

  const checkPaymentStatus = useCallback(() => {
    const projectKey = getProjectKey();
    return sessionStorage.getItem('razorpay_payment_verified') === 'true' ||
           localStorage.getItem('razorpay_payment_verified') === 'true' ||
           (projectKey ? localStorage.getItem(projectKey) === 'true' : false);
  }, [getProjectKey]);

  const markPaymentComplete = useCallback(() => {
    const projectKey = getProjectKey();
    sessionStorage.setItem('razorpay_payment_verified', 'true');
    localStorage.setItem('razorpay_payment_verified', 'true');
    if (projectKey) {
      localStorage.setItem(projectKey, 'true');
    }
    setPaymentComplete(true);
  }, [getProjectKey]);

  const initiatePayment = useCallback(async (amount: number = 50): Promise<boolean> => {
    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay. Please check your internet connection.');
        setIsProcessing(false);
        return false;
      }

      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: amount.toString(), description: 'AI Report Download' },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Failed to create order');
      }

      // Open Razorpay checkout
      return new Promise<boolean>((resolve) => {
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: 'AI Project Report Generator',
          description: 'AI-Generated Project Report Download',
          order_id: data.order_id,
          handler: async (response: any) => {
            console.log('[Razorpay] handler fired:', response);
            try {
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              });
              console.log('[Razorpay] verify result:', { verifyData, verifyError });

              if (verifyError || !verifyData?.verified) {
                console.error('[Razorpay] verification failed', verifyError, verifyData);
                toast.error(`Payment verification failed: ${verifyError?.message || verifyData?.error || 'Unknown error'}`);
                resolve(false);
              } else {
                markPaymentComplete();
                toast.success('Payment successful! You can now download your report.');
                resolve(true);
              }
            } catch (err: any) {
              console.error('[Razorpay] handler exception:', err);
              toast.error(`Payment verification failed: ${err?.message || 'Unknown error'}`);
              resolve(false);
            }
            setIsProcessing(false);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              resolve(false);
            },
          },
          theme: {
            color: '#1a365d',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response.error);
          toast.error(response.error.description || 'Payment failed. Please try again.');
          setIsProcessing(false);
          resolve(false);
        });
        rzp.open();
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      return false;
    }
  }, [markPaymentComplete]);

  return {
    isProcessing,
    paymentComplete,
    isPaid: checkPaymentStatus() || paymentComplete,
    initiatePayment,
    checkPaymentStatus,
    markPaymentComplete,
  };
};
