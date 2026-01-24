import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UPIPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  onPaymentConfirmed: () => void;
}

const UPI_ID = "7354aborh@ybl"; // Your UPI ID

const UPIPaymentDialog = ({ 
  open, 
  onOpenChange, 
  amount, 
  onPaymentConfirmed 
}: UPIPaymentDialogProps) => {
  const [step, setStep] = useState<'pay' | 'confirm'>('pay');

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=SVCE%20Report&am=${amount}&cu=INR&tn=AI%20Report%20Download`;
  
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success('UPI ID copied to clipboard!');
  };

  const handleOpenUPI = () => {
    window.open(upiLink, '_blank');
    setStep('confirm');
  };

  const handleConfirmPayment = () => {
    onPaymentConfirmed();
    toast.success('Payment confirmed! You can now download your report.');
    onOpenChange(false);
    setStep('pay');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep('pay');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {step === 'pay' ? 'Pay via UPI' : 'Confirm Payment'}
          </DialogTitle>
          <DialogDescription>
            {step === 'pay' 
              ? `Pay ₹${amount} to download your AI-generated report`
              : 'Did you complete the payment?'
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === 'pay' ? (
          <div className="space-y-4 py-4">
            {/* UPI ID Display */}
            <div className="bg-muted rounded-lg p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Pay to UPI ID:</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-primary">{UPI_ID}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleCopyUPI}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-accent/30 border border-accent rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl font-bold text-primary">₹{amount}</p>
            </div>

            {/* Pay Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 gap-2" 
              size="lg"
              onClick={handleOpenUPI}
            >
              <ExternalLink className="w-4 h-4" />
              Open UPI App to Pay
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Click above to open your UPI app (GPay, PhonePe, Paytm, etc.)
              </p>
              <p className="text-xs text-muted-foreground">
                Or manually scan QR / enter UPI ID in your payment app
              </p>
            </div>

            {/* Manual Payment Option */}
            <div className="border-t pt-4">
              <p className="text-sm text-center text-muted-foreground mb-2">
                Already paid manually?
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('confirm')}
              >
                I've Already Paid
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="text-destructive text-sm">
                  Please confirm only if you have successfully completed the payment of <strong>₹{amount}</strong> to <strong>{UPI_ID}</strong>
                </p>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 gap-2" 
                size="lg"
                onClick={handleConfirmPayment}
              >
                <CheckCircle className="w-4 h-4" />
                Yes, I've Paid ₹{amount}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('pay')}
              >
                Go Back to Payment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UPIPaymentDialog;
