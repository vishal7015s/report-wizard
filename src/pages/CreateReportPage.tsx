import { useReportStore } from '@/store/reportStore';
import CollegeSelection from '@/components/steps/CollegeSelection';
import UserDetailsForm from '@/components/steps/UserDetailsForm';
import ContentEditor from '@/components/steps/ContentEditor';
import ReportPreview from '@/components/steps/ReportPreview';
import StepIndicator from '@/components/StepIndicator';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 0, title: 'Select College' },
  { id: 1, title: 'Project Details' },
  { id: 2, title: 'Content' },
  { id: 3, title: 'Preview & Download' },
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
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Project Report Generator</h1>
                <p className="text-sm text-muted-foreground">{steps[currentStep]?.title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {renderStep()}
      </main>
    </div>
  );
};

export default CreateReportPage;
