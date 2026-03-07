import { useReportStore } from '@/store/reportStore';
import { branches, projectTypes, sessions } from '@/types/report';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, User, ArrowRight, BookOpen, Users, GraduationCap } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
);

const UserDetailsForm = () => {
  const { 
    reportData, 
    setProjectDetails, 
    addStudent, 
    removeStudent, 
    updateStudent, 
    setCurrentStep 
  } = useReportStore();
  
  const { projectDetails } = reportData;

  const handleNext = () => {
    setCurrentStep(2);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Project Details</h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Enter your project and student information
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Project Information */}
        <div className="bg-card rounded-xl sm:rounded-2xl border p-4 sm:p-6">
          <SectionHeader icon={BookOpen} title="Project Information" />
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Project Type</Label>
                <Select
                  value={projectDetails.projectType}
                  onValueChange={(value) => setProjectDetails({ projectType: value as any })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Branch</Label>
                <Select
                  value={projectDetails.branch}
                  onValueChange={(value) => setProjectDetails({ branch: value, department: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Project Title</Label>
              <Input
                placeholder='e.g., "SVCE Aptitude"'
                className="rounded-xl"
                value={projectDetails.projectTitle}
                onChange={(e) => setProjectDetails({ projectTitle: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Session</Label>
              <Select
                value={projectDetails.session}
                onValueChange={(value) => setProjectDetails({ session: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Guide Information */}
        <div className="bg-card rounded-xl sm:rounded-2xl border p-4 sm:p-6">
          <SectionHeader icon={GraduationCap} title="Guide & HOD Details" />
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Guide Name</Label>
                <Input
                  placeholder="e.g., Ms. Suchita Rathore"
                  className="rounded-xl"
                  value={projectDetails.guideName}
                  onChange={(e) => setProjectDetails({ guideName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Guide Designation</Label>
                <Select
                  value={projectDetails.guideDesignation}
                  onValueChange={(value) => setProjectDetails({ guideDesignation: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asst. Prof">Asst. Prof</SelectItem>
                    <SelectItem value="Assoc. Prof">Assoc. Prof</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="HOD">HOD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">HOD Name</Label>
              <Input
                placeholder="e.g., Mr. Chandrashekhar Kothari"
                className="rounded-xl"
                value={projectDetails.hodName}
                onChange={(e) => setProjectDetails({ hodName: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="bg-card rounded-xl sm:rounded-2xl border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader icon={Users} title="Students" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStudent}
              className="gap-1.5 rounded-xl text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {projectDetails.students.map((student, index) => (
              <div
                key={student.id}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <Input
                      placeholder="e.g., Vishal Hardiya"
                      className="rounded-xl h-9"
                      value={student.name}
                      onChange={(e) => updateStudent(student.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Enrollment No.</Label>
                    <Input
                      placeholder="e.g., 0822IT221136"
                      className="rounded-xl h-9"
                      value={student.enrollmentNumber}
                      onChange={(e) => updateStudent(student.id, { enrollmentNumber: e.target.value })}
                    />
                  </div>
                </div>
                {projectDetails.students.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-7 w-7 mt-1"
                    onClick={() => removeStudent(student.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} className="gap-2 rounded-xl">
          Next: Add Content
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserDetailsForm;
