import { useReportStore } from '@/store/reportStore';
import { colleges } from '@/types/report';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Building2 } from 'lucide-react';

const CollegeSelection = () => {
  const { setCollege, setCurrentStep } = useReportStore();

  const handleSelectCollege = (college: typeof colleges[0]) => {
    setCollege(college);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your College</h2>
        <p className="text-muted-foreground">
          Choose your college to apply the correct report format
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <button
            key={college.id}
            onClick={() => handleSelectCollege(college)}
            className="group bg-card border-2 border-border hover:border-primary rounded-xl p-6 text-left transition-all duration-300 card-hover"
          >
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-1">{college.shortName}</h3>
              <p className="text-sm text-muted-foreground mb-2">{college.name}</p>
              <p className="text-xs text-muted-foreground">{college.location}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Select <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        ))}

        {/* Coming Soon Card */}
        <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-1 text-muted-foreground">More Colleges</h3>
          <p className="text-sm text-muted-foreground">Coming Soon</p>
          <p className="text-xs text-muted-foreground mt-2">
            Contact us to add your college format
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don't see your college? Email us at <span className="text-primary">support@projectreport.in</span>
        </p>
      </div>
    </div>
  );
};

export default CollegeSelection;
