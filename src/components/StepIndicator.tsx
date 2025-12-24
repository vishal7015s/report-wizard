import { CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="bg-muted/30 py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep > index
                      ? 'bg-green-500 text-white'
                      : currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > index ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-sm hidden md:block whitespace-nowrap ${
                    currentStep >= index ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 md:w-16 h-0.5 mx-2 ${
                    currentStep > index ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
