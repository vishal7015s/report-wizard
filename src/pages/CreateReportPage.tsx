import { useReportStore } from '@/store/reportStore';
import CollegeSelection from '@/components/steps/CollegeSelection';
import UserDetailsForm from '@/components/steps/UserDetailsForm';
import ContentEditor from '@/components/steps/ContentEditor';
import ReportPreview from '@/components/steps/ReportPreview';
import { ArrowLeft, CheckCircle, Building2, FileText, PenLine, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 0, title: 'Select College', icon: Building2 },
  { id: 1, title: 'Project Details', icon: FileText },
  { id: 2, title: 'Content', icon: PenLine },
  { id: 3, title: 'Preview & Download', icon: Eye },
];

const CreateReportPage = () => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useReportStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CollegeSelection />;
      case 1:
        return <UserDetailsForm />;
      case 2:
        return <ContentEditor />;
      case 3:
        return <ReportPreview />;
      default:
        return <CollegeSelection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-4 md:px-6 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-foreground truncate">Project Report Generator</h1>
          <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length} — {steps[currentStep]?.title}</p>
        </div>

        {/* Mobile step counter */}
        <div className="flex md:hidden items-center gap-1.5">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-all ${
                i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary w-4' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Desktop Only */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border/50 bg-card/50 p-6 shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">Progress</p>
          <nav className="space-y-1">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > index;
              const isActive = currentStep === index;
              const isFuture = currentStep < index;

              return (
                <button
                  key={step.id}
                  onClick={() => { if (isCompleted) setCurrentStep(index); }}
                  disabled={isFuture}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : isCompleted
                      ? 'text-foreground hover:bg-secondary cursor-pointer'
                      : 'text-muted-foreground/50 cursor-default'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                      ? 'bg-primary/15 text-primary'
                      : 'bg-secondary text-muted-foreground/40'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${isActive ? 'font-semibold' : isCompleted ? 'font-medium' : ''}`}>
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Progress bar */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateReportPage;
