import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { colleges } from '@/types/report';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { FileText, Upload, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

const AddTemplate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [fontFamily, setFontFamily] = useState('');
  const [chapterSize, setChapterSize] = useState('');
  const [sectionSize, setSectionSize] = useState('');
  const [subSectionSize, setSubSectionSize] = useState('');
  const [hasBorder, setHasBorder] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCollege) {
      toast.error('Please select a college');
      return;
    }
    
    if (!files || files.length < 1) {
      toast.error('Please upload at least one PDF');
      return;
    }

    setLoading(true);
    try {
      // Mock Cloudinary upload for all selected files
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      
      console.log('Uploaded URLs:', urls);
      console.log('Template Data:', {
        collegeId: selectedCollege,
        fontFamily,
        fontSizes: {
          chapter: chapterSize || '18',
          section: sectionSize || '14',
          subSection: subSectionSize || '12'
        },
        hasBorder
      });

      setSubmitted(true);
      toast.success('Successfully submitted!');
    } catch (error) {
      toast.error('Failed to upload files. Please check your Cloudinary configuration.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">new formatted submitted</h2>
          <div className="bg-muted/50 rounded-2xl p-4 mb-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground italic block mb-1">Notice:</span>
              The template updates are currently being processed. Please allow up to 24 hours for the changes to be fully reflected across the main platform.
            </p>
          </div>
          <Button 
            className="w-full rounded-xl py-6"
            onClick={() => setSubmitted(false)}
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Add Template</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* College Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80 lowercase">Select College</Label>
                <Select onValueChange={setSelectedCollege} value={selectedCollege}>
                  <SelectTrigger className="rounded-xl py-6 bg-muted/30 border-border/50">
                    <SelectValue placeholder="choose a college" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id} className="rounded-lg">
                        {college.name} ({college.shortName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* PDF Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80 lowercase">Upload Template PDFs</Label>
                <div className="group relative">
                  <div className="border-2 border-dashed border-border group-hover:border-primary/50 transition-colors rounded-2xl p-8 text-center bg-muted/10">
                    <Input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => setFiles(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Click to upload PDFs</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You can select multiple files at once (Minimum 2-3 recommended)
                        </p>
                      </div>
                    </div>
                  </div>
                  {files && files.length > 0 && (
                    <div className="mt-4 space-y-2">
                       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Selected Files ({files.length})</p>
                       {Array.from(files).map((file, i) => (
                         <div key={i} className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg text-xs text-foreground">
                           <FileText className="w-3.5 h-3.5 text-primary" />
                           <span className="truncate">{file.name}</span>
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Typography Settings */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground/80 lowercase">Font Family</Label>
                  <Input 
                    placeholder="e.g. Times New Roman" 
                    className="rounded-xl py-6 bg-muted/30 border-border/50"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground/80 lowercase">Chapter Font Size (px)</Label>
                  <Input 
                    type="number"
                    placeholder="18" 
                    className="rounded-xl py-6 bg-muted/30 border-border/50"
                    value={chapterSize}
                    onChange={(e) => setChapterSize(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground/80 lowercase">Section Font Size (px)</Label>
                  <Input 
                    type="number"
                    placeholder="14" 
                    className="rounded-xl py-6 bg-muted/30 border-border/50"
                    value={sectionSize}
                    onChange={(e) => setSectionSize(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground/80 lowercase">Sub Section Font Size (px)</Label>
                  <Input 
                    type="number"
                    placeholder="12" 
                    className="rounded-xl py-6 bg-muted/30 border-border/50"
                    value={subSectionSize}
                    onChange={(e) => setSubSectionSize(e.target.value)}
                  />
                </div>
              </div>

              {/* Page Border */}
              <div className="flex items-center space-x-3 bg-muted/20 p-4 rounded-2xl border border-border/50">
                <Checkbox 
                  id="border" 
                  checked={hasBorder}
                  onCheckedChange={(checked) => setHasBorder(checked as boolean)}
                  className="w-5 h-5 rounded-md"
                />
                <label
                  htmlFor="border"
                  className="text-sm font-medium leading-none cursor-pointer text-foreground/80"
                >
                  Apply Page Border
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full py-7 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading Template...
                  </>
                ) : (
                  'Submit Template for Approval'
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTemplate;
