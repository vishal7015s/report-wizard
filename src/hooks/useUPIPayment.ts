import { useState } from 'react';

export const useUPIPayment = () => {
  const [paymentComplete, setPaymentComplete] = useState(false);

  const checkPaymentStatus = () => {
    return sessionStorage.getItem('upi_payment_verified') === 'true';
  };

  const markPaymentComplete = () => {
    sessionStorage.setItem('upi_payment_verified', 'true');
    setPaymentComplete(true);
  };

  const clearPaymentStatus = () => {
    sessionStorage.removeItem('upi_payment_verified');
    setPaymentComplete(false);
  };

  return {
    paymentComplete,
    checkPaymentStatus,
    markPaymentComplete,
    clearPaymentStatus,
  };
};
