import { useReportStore } from '@/store/reportStore';
import CollegeSelection from '@/components/steps/CollegeSelection';
import UserDetailsForm from '@/components/steps/UserDetailsForm';
import ContentEditor from '@/components/steps/ContentEditor';
import ReportPreview from '@/components/steps/ReportPreview';
import StepIndicator from '@/components/StepIndicator';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 0, title: 'Select College', description: 'Choose your institution' },
  { id: 1, title: 'Project Details', description: 'Enter project info' },
  { id: 2, title: 'Content', description: 'Add report content' },
  { id: 3, title: 'Preview & Download', description: 'Review and export' },
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-muted/80 transition-colors"
                onClick={() =>
                  currentStep > 0
                    ? setCurrentStep(currentStep - 1)
                    : navigate('/')
                }
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="h-6 w-px bg-border/60" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold tracking-tight text-foreground">
                    Report Generator
                  </h1>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Step {currentStep + 1} — {steps[currentStep]?.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile step indicator */}
            <div className="lg:hidden flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">
                {currentStep + 1}
              </span>
              <span className="text-xs text-muted-foreground/60">/</span>
              <span className="text-xs text-muted-foreground">{steps.length}</span>
            </div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden h-[2px] bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* Main layout with sidebar */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex gap-10">
          {/* Sidebar step indicator */}
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          {/* Content */}
          <main className="flex-1 min-w-0">{renderStep()}</main>
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;
