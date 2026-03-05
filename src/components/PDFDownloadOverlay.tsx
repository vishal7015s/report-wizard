import { useEffect, useState } from 'react';
import { FileDown, FileText, Image, CheckCircle, Loader2 } from 'lucide-react';

const steps = [
  { icon: FileText, text: 'Preparing pages for export...' },
  { icon: Image, text: 'Rendering images & diagrams...' },
  { icon: FileDown, text: 'Compiling PDF document...' },
];

const PDFDownloadOverlay = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 3;
      });
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm mx-4">
        <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl animate-pulse" />
        
        <div className="relative bg-card border border-border rounded-2xl p-6 shadow-xl text-center space-y-5">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Loader2 className="w-7 h-7 text-primary-foreground animate-spin" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground">Generating Your PDF</h3>
            <p className="text-sm text-muted-foreground mt-1">High quality export in progress...</p>
          </div>

          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>

          <div className="space-y-2 text-left">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-500 ${
                    isActive ? 'bg-primary/10 text-foreground' : isDone ? 'text-muted-foreground' : 'text-muted-foreground/40'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${
                    isActive ? 'bg-primary text-primary-foreground' : isDone ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground/40'
                  }`}>
                    {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />}
                  </div>
                  <span className="text-sm">{step.text}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
            ⏳ Please don't close this page
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFDownloadOverlay;
