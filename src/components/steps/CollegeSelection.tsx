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
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Select Your College</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Choose your institution to apply the correct report format
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {colleges.map((college) => (
          <button
            key={college.id}
            onClick={() => handleSelectCollege(college)}
            className="group relative bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-7 text-left transition-all duration-300 hover:shadow-card hover:-translate-y-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors duration-300 ring-1 ring-primary/10 group-hover:ring-primary/25">
                <Building2 className="w-5.5 h-5.5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg tracking-tight text-foreground mb-1.5">{college.shortName}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{college.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <MapPin className="w-3 h-3" />
                {college.location}
              </div>
              <div className="mt-5 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                Select <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        ))}

        {/* Coming Soon Card */}
        <div className="bg-muted/20 border border-dashed border-border/50 rounded-2xl p-7 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center mb-5">
            <GraduationCap className="w-6 h-6 text-muted-foreground/60" />
          </div>
          <h3 className="font-semibold text-foreground/50 mb-1">More Colleges</h3>
          <p className="text-xs text-muted-foreground/60">Coming Soon</p>
          <p className="text-xs text-muted-foreground/50 mt-3 leading-relaxed">
            Contact us to add your college format
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground/70">
          Don't see your college? Email us at{' '}
          <span className="text-primary font-medium hover:underline cursor-pointer">support@projectreport.in</span>
        </p>
      </div>
    </div>
  );
};

export default CollegeSelection;
