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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Project Details</h2>
        <p className="text-muted-foreground">
          Enter your project and student information
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-soft space-y-6">
        {/* Project Type & Branch */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Project Type *</Label>
            <Select
              value={projectDetails.projectType}
              onValueChange={(value) => setProjectDetails({ projectType: value as any })}
            >
              <SelectTrigger>
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
            <Label>Branch *</Label>
            <Select
              value={projectDetails.branch}
              onValueChange={(value) => setProjectDetails({ branch: value, department: value })}
            >
              <SelectTrigger>
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

        {/* Project Title */}
        <div className="space-y-2">
          <Label>Project Title *</Label>
          <Input
            placeholder='e.g., "Multiple-Disease-Prediction"'
            value={projectDetails.projectTitle}
            onChange={(e) => setProjectDetails({ projectTitle: e.target.value })}
          />
        </div>

        {/* Guide Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Guided By (Faculty Name) *</Label>
            <Input
              placeholder="e.g., Ms. Priyanka Choudhary"
              value={projectDetails.guideName}
              onChange={(e) => setProjectDetails({ guideName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Guide Designation</Label>
            <Select
              value={projectDetails.guideDesignation}
              onValueChange={(value) => setProjectDetails({ guideDesignation: value })}
            >
              <SelectTrigger>
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

        {/* HOD Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>HOD Name *</Label>
            <Input
              placeholder="e.g., Mr. Ashish Tiwari"
              value={projectDetails.hodName}
              onChange={(e) => setProjectDetails({ hodName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Session *</Label>
            <Select
              value={projectDetails.session}
              onValueChange={(value) => setProjectDetails({ session: value })}
            >
              <SelectTrigger>
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

        {/* Students Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Students</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStudent}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>

          <div className="space-y-3">
            {projectDetails.students.map((student, index) => (
              <div
                key={student.id}
                className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Student Name</Label>
                    <Input
                      placeholder="e.g., Sachin Patel"
                      value={student.name}
                      onChange={(e) => updateStudent(student.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Enrollment Number</Label>
                    <Input
                      placeholder="e.g., 0822IT221103"
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
                    onClick={() => removeStudent(student.id)}
                    className="text-destructive hover:text-destructive"
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
      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} className="gap-2">
          Next: Add Content
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserDetailsForm;
