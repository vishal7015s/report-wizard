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
    <div className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          Progress
        </h3>
        <div className="space-y-1">
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
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : isCompleted
                      ? 'text-foreground hover:bg-muted/50 cursor-pointer'
                      : 'text-muted-foreground cursor-default'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground'
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
                      className={`text-sm font-medium truncate ${
                        isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="ml-[22px] h-4 flex items-center">
                    <div
                      className={`w-0.5 h-full rounded-full ${
                        isCompleted ? 'bg-green-500/30' : 'bg-border'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep) / (steps.length - 1)) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
