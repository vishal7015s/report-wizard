import { useEffect } from 'react';
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
  const isPreviewStep = currentStep === 3;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep]);

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
    <div className={isPreviewStep ? 'h-screen bg-background flex flex-col overflow-hidden' : 'min-h-screen bg-background'}>
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() =>
                  currentStep > 0
                    ? setCurrentStep(currentStep - 1)
                    : navigate('/')
                }
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">
                    Report Generator
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {steps[currentStep]?.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile step indicator */}
            <div className="lg:hidden flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {currentStep + 1}
              </span>
              <span>/</span>
              <span>{steps.length}</span>
            </div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* Main layout with sidebar */}
      <div className={`container mx-auto px-4 ${isPreviewStep ? 'py-3 flex-1 min-h-0 overflow-hidden' : 'py-8'}`}>
        <div className={`flex gap-8 ${isPreviewStep ? 'h-full overflow-hidden' : ''}`}>
          {/* Sidebar step indicator */}
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          {/* Content */}
          <main className={`flex-1 min-w-0 ${isPreviewStep ? 'h-full overflow-hidden' : ''}`}>{renderStep()}</main>
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;
