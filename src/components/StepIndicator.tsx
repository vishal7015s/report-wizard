import { CheckCircle, Building2, ClipboardList, FileEdit, Eye } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const stepIcons = [Building2, ClipboardList, FileEdit, Eye];

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-28 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-7 shadow-soft">
        <div className="flex items-center justify-between mb-7">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Progress
          </h3>
          <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {Math.round(((currentStep) / (steps.length - 1)) * 100)}%
          </span>
        </div>
        <div className="space-y-0.5">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;
            const isFuture = currentStep < index;
            const Icon = stepIcons[index] || ClipboardList;

            return (
              <div key={step.id}>
                <button
                  onClick={() => isCompleted && onStepClick?.(index)}
                  disabled={isFuture}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/8 ring-1 ring-primary/20'
                      : isCompleted
                      ? 'hover:bg-muted/40 cursor-pointer'
                      : 'opacity-50 cursor-default'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20'
                        : isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                        : 'bg-muted/60 text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-medium truncate leading-tight ${
                        isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="ml-[23px] h-3 flex items-center">
                    <div
                      className={`w-[1.5px] h-full rounded-full transition-colors duration-300 ${
                        isCompleted ? 'bg-green-500/25' : 'bg-border/40'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-7 pt-5 border-t border-border/40">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2.5">
            <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full h-1 bg-muted/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
