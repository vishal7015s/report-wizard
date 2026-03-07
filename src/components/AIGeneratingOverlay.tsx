import { useEffect, useState } from 'react';
import { Sparkles, FileText, BookOpen, Brain, Lightbulb, PenTool, AlertTriangle, Download } from 'lucide-react';

type OverlayMode = 'generating' | 'completing' | 'downloading';

const modeConfig = {
  generating: {
    title: 'AI is Writing Your Report',
    subtitle: 'This usually takes 30-60 seconds',
    warning: '⚠️ Do not close or refresh this page, otherwise your progress will be lost!',
    steps: [
      { icon: Brain, text: 'Analyzing your project description...' },
      { icon: Lightbulb, text: 'Structuring chapters & sections...' },
      { icon: PenTool, text: 'Writing abstract & acknowledgement...' },
      { icon: BookOpen, text: 'Generating detailed chapter content...' },
      { icon: FileText, text: 'Finalizing your report preview...' },
    ],
  },
  completing: {
    title: 'Generating Complete Report',
    subtitle: 'Creating remaining chapters after payment...',
    warning: '⚠️ Do not close or refresh this page, otherwise your payment will fail and report won\'t generate!',
    steps: [
      { icon: Brain, text: 'Verifying payment status...' },
      { icon: Lightbulb, text: 'Loading existing chapters...' },
      { icon: PenTool, text: 'Generating chapters 4-5...' },
      { icon: BookOpen, text: 'Generating chapters 6-7...' },
      { icon: FileText, text: 'Finalizing complete report...' },
    ],
  },
  downloading: {
    title: 'Preparing Your Download',
    subtitle: 'Converting report to file...',
    warning: '⚠️ Do not close this page until download completes!',
    steps: [
      { icon: FileText, text: 'Rendering report pages...' },
      { icon: BookOpen, text: 'Processing images & diagrams...' },
      { icon: PenTool, text: 'Formatting document layout...' },
      { icon: Download, text: 'Preparing file for download...' },
    ],
  },
};

interface AIGeneratingOverlayProps {
  mode?: OverlayMode;
}

const AIGeneratingOverlay = ({ mode = 'generating' }: AIGeneratingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const config = modeConfig[mode];
  const steps = config.steps;

  useEffect(() => {
    setCurrentStep(0);
    setProgress(0);
  }, [mode]);

  useEffect(() => {
    const stepDuration = mode === 'downloading' ? 3000 : 4000;
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepDuration);

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
  }, [mode, steps.length]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl animate-pulse" />
        
        <div className="relative bg-card border border-border rounded-2xl p-4 sm:p-8 shadow-elevated text-center space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Warning banner */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium text-destructive text-left">
              {config.warning}
            </p>
          </div>

          {/* Animated icon */}
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-1 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-primary-foreground animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">{config.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{config.subtitle}</p>
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
          <div className="space-y-2 sm:space-y-3 text-left">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-500 ${
                    isActive
                      ? 'bg-primary/10 text-foreground'
                      : isDone
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/40'
                  }`}
                >
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground/40'
                  }`}>
                    {isDone ? (
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{step.text}</span>
                </div>
              );
            })}
          </div>

          {/* Fun tip */}
          <p className="text-[10px] sm:text-xs text-muted-foreground italic border-t border-border pt-3 sm:pt-4">
            💡 Tip: You can edit any AI-generated content after generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratingOverlay;
