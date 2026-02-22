import { useReportStore } from '@/store/reportStore';
import { colleges } from '@/types/report';
import { ArrowRight, Building2, GraduationCap, MapPin } from 'lucide-react';

const CollegeSelection = () => {
  const { setCollege, setCurrentStep } = useReportStore();

  const handleSelectCollege = (college: typeof colleges[0]) => {
    setCollege(college);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">Select Your College</h2>
        <p className="text-muted-foreground text-sm">
          Choose your college to apply the correct report format and guidelines.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {colleges.map((college) => (
          <button
            key={college.id}
            onClick={() => handleSelectCollege(college)}
            className="group bg-card border border-border/50 hover:border-primary/50 rounded-2xl p-6 text-left transition-all duration-300 card-hover shadow-card hover:shadow-glow"
          >
            <div className="w-14 h-14 mx-auto bg-primary/8 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Building2 className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-foreground mb-1">{college.shortName}</h3>
              <p className="text-sm text-muted-foreground mb-1">{college.name}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {college.location}
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Select <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        ))}

        {/* Coming Soon */}
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-muted-foreground mb-1">More Colleges</h3>
          <p className="text-xs text-muted-foreground">Coming Soon</p>
          <p className="text-xs text-muted-foreground mt-2">
            Contact us to add your college format
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don't see your college? Email us at <span className="text-primary font-medium">support@projectreport.in</span>
        </p>
      </div>
    </div>
  );
};

export default CollegeSelection;
