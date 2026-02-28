import { useReportStore } from '@/store/reportStore';
import { colleges } from '@/types/report';
import { GraduationCap, ArrowRight, Building2, MapPin } from 'lucide-react';

const CollegeSelection = () => {
  const { setCollege, setCurrentStep } = useReportStore();

  const handleSelectCollege = (college: typeof colleges[0]) => {
    setCollege(college);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">Select Your College</h2>
        <p className="text-muted-foreground text-sm">
          Choose your institution to apply the correct report format
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {colleges.map((college) => (
          <button
            key={college.id}
            onClick={() => handleSelectCollege(college)}
            className="group relative bg-card border border-border hover:border-primary/50 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">{college.shortName}</h3>
              <p className="text-sm text-muted-foreground mb-2">{college.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {college.location}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1">
                Select <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        ))}

        {/* Coming Soon Card */}
        <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground/60 mb-0.5">More Colleges</h3>
          <p className="text-xs text-muted-foreground">Coming Soon</p>
          <p className="text-xs text-muted-foreground mt-2">
            Contact us to add your college format
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Don't see your college? Email us at{' '}
          <span className="text-primary font-medium">developer.vishalshivhare123@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default CollegeSelection;
