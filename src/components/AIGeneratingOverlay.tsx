import { useEffect, useState } from 'react';
import { Sparkles, FileText, BookOpen, Brain, Lightbulb, PenTool } from 'lucide-react';

const steps = [
  { icon: Brain, text: 'Analyzing your project description...' },
  { icon: Lightbulb, text: 'Structuring chapters & sections...' },
  { icon: PenTool, text: 'Writing abstract & acknowledgement...' },
  { icon: BookOpen, text: 'Generating detailed chapter content...' },
  { icon: FileText, text: 'Finalizing your report preview...' },
];

const AIGeneratingOverlay = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.random() * 2;
      });
    }, 300);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-md mx-4">
        {/* Glow effect */}
        <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl animate-pulse" />
        
        <div className="relative bg-card border border-border rounded-2xl p-8 shadow-elevated text-center space-y-6">
          {/* Animated icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-1 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-9 h-9 text-primary-foreground animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-foreground">AI is Writing Your Report</h3>
            <p className="text-sm text-muted-foreground mt-1">This usually takes 30-60 seconds</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>

          {/* Steps */}
          <div className="space-y-3 text-left">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-500 ${
                    isActive
                      ? 'bg-primary/10 text-foreground'
                      : isDone
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/40'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground/40'
                  }`}>
                    {isDone ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? '' : ''}`}>{step.text}</span>
                </div>
              );
            })}
          </div>

          {/* Fun tip */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
            💡 Tip: You can edit any AI-generated content after generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratingOverlay;
