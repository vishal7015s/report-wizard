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
import { Plus, Trash2, User, ArrowRight } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">Project Details</h2>
        <p className="text-sm text-muted-foreground">
          Enter your project and student information. Takes less than 1 minute.
        </p>
      </div>

      <div className="space-y-8">
        {/* Project Information */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <h3 className="font-bold text-foreground text-sm">Project Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Project Type *</Label>
              <Select
                value={projectDetails.projectType}
                onValueChange={(value) => setProjectDetails({ projectType: value as any })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Branch *</Label>
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

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Project Title *</Label>
            <Input
              placeholder='e.g., "Multiple-Disease-Prediction"'
              value={projectDetails.projectTitle}
              onChange={(e) => setProjectDetails({ projectTitle: e.target.value })}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Guide Information */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <h3 className="font-bold text-foreground text-sm">Guide Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Guided By (Faculty Name) *</Label>
              <Input
                placeholder="e.g., Ms. Priyanka Choudhary"
                value={projectDetails.guideName}
                onChange={(e) => setProjectDetails({ guideName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Guide Designation</Label>
              <Select
                value={projectDetails.guideDesignation}
                onValueChange={(value) => setProjectDetails({ guideDesignation: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select designation" />
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
        </div>

        {/* Session Details */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <h3 className="font-bold text-foreground text-sm">Session & HOD Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">HOD Name *</Label>
              <Input
                placeholder="e.g., Mr. Ashish Tiwari"
                value={projectDetails.hodName}
                onChange={(e) => setProjectDetails({ hodName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Session *</Label>
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

        {/* Students Section */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-primary rounded-full" />
              <h3 className="font-bold text-foreground text-sm">Students</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStudent}
              className="gap-1.5 rounded-xl text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Student
            </Button>
          </div>

          <div className="space-y-3">
            {projectDetails.students.map((student, index) => (
              <div
                key={student.id}
                className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Student Name</Label>
                    <Input
                      placeholder="e.g., Sachin Patel"
                      value={student.name}
                      onChange={(e) => updateStudent(student.id, { name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Enrollment Number</Label>
                    <Input
                      placeholder="e.g., 0822IT221103"
                      value={student.enrollmentNumber}
                      onChange={(e) => updateStudent(student.id, { enrollmentNumber: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                {projectDetails.students.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStudent(student.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <Button onClick={handleNext} className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 font-semibold">
          Next: Add Content
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserDetailsForm;
