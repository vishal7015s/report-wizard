import { useState, useRef } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  PenLine, 
  Plus, 
  Trash2, 
  ArrowRight,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';

const ContentEditor = () => {
  const { 
    contentMode, 
    setContentMode, 
    reportData, 
    setAbstract,
    setAcknowledgement,
    addChapter,
    removeChapter,
    addSection,
    removeSection,
    updateSection,
    addImageToSection,
    removeImageFromSection,
    setCurrentStep 
  } = useReportStore();
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeChapter, setActiveChapter] = useState(reportData.chapters[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSectionForImage, setCurrentSectionForImage] = useState<{chapterId: string, sectionId: string} | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentSectionForImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        addImageToSection(currentSectionForImage.chapterId, currentSectionForImage.sectionId, {
          id: Date.now().toString(),
          url: imageUrl,
          caption: file.name.replace(/\.[^/.]+$/, '')
        });
        setCurrentSectionForImage(null);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImageUpload = (chapterId: string, sectionId: string) => {
    setCurrentSectionForImage({ chapterId, sectionId });
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  const currentChapter = reportData.chapters.find(c => c.id === activeChapter);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a365d] mb-2">Add Content</h2>
        <p className="text-muted-foreground">
          Choose how you want to add content to your report
        </p>
      </div>

      <Tabs value={contentMode} onValueChange={(v) => setContentMode(v as 'ai' | 'manual')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Generate (₹10)
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <PenLine className="w-4 h-4" />
            Manual Editor (Free)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-[#1a365d]">Describe Your Project</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a detailed description of your project. AI will generate content for all chapters.
                </p>
              </div>
              <Textarea
                placeholder="Example: My project is about predicting multiple diseases using machine learning. The system uses patient health parameters like blood pressure, glucose levels, cholesterol, BMI, and age to predict the likelihood of heart disease and diabetes. We implemented Logistic Regression, SVM, Random Forest, and KNN algorithms..."
                className="min-h-[200px] font-serif"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button className="w-full gap-2 bg-[#1a365d] hover:bg-[#2d4a7c]" disabled>
                <Sparkles className="w-4 h-4" />
                Generate Content (Coming Soon)
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                AI generation costs ₹10. For free reports, use the Manual Editor.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          {/* Abstract */}
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <Label className="text-base font-semibold text-[#1a365d]">Abstract</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              A brief summary of your project (150-300 words)
            </p>
            <Textarea
              placeholder="Write your project abstract here..."
              className="min-h-[150px] font-serif"
              value={reportData.abstract}
              onChange={(e) => setAbstract(e.target.value)}
            />
          </div>

          {/* Acknowledgement */}
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <Label className="text-base font-semibold text-[#1a365d]">Acknowledgement</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Thank your guides, HOD, principal, and others
            </p>
            <Textarea
              placeholder="Write your acknowledgement here..."
              className="min-h-[150px] font-serif"
              value={reportData.acknowledgement}
              onChange={(e) => setAcknowledgement(e.target.value)}
            />
          </div>

          {/* Chapter-wise Editor */}
          <div className="bg-card rounded-xl border shadow-soft overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <h3 className="font-semibold text-[#1a365d]">Chapter-wise Editor</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addChapter}
                className="gap-2 border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </Button>
            </div>

            {/* Chapter Tabs */}
            <div className="p-4 border-b bg-muted/20">
              <div className="flex flex-wrap gap-2 justify-center">
                {reportData.chapters.map((chapter) => (
                  <Button
                    key={chapter.id}
                    variant={activeChapter === chapter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveChapter(chapter.id)}
                    className={activeChapter === chapter.id 
                      ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' 
                      : 'border-[#1a365d] text-[#1a365d]'
                    }
                  >
                    Chapter {chapter.number}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Chapter Content */}
            {currentChapter && (
              <div className="p-6 space-y-6">
                {/* Chapter Title */}
                <div className="bg-[#1a365d] text-white py-3 px-4 rounded-lg text-center">
                  <Input
                    value={currentChapter.title}
                    onChange={(e) => {
                      const updatedChapters = reportData.chapters.map(c =>
                        c.id === currentChapter.id ? { ...c, title: e.target.value.toUpperCase() } : c
                      );
                      useReportStore.getState().setChapters(updatedChapters);
                    }}
                    className="bg-transparent border-none text-center text-white font-bold uppercase tracking-wide focus-visible:ring-0"
                  />
                </div>

                {/* Sections */}
                {currentChapter.sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4 space-y-4 bg-muted/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">Section</Label>
                          <span className="w-12 h-9 flex items-center justify-center bg-muted rounded text-sm font-medium">
                            {section.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">Heading</Label>
                          <Input
                            value={section.heading}
                            onChange={(e) => updateSection(currentChapter.id, section.id, { heading: e.target.value })}
                            className="w-64 h-9"
                          />
                        </div>
                      </div>
                      {currentChapter.sections.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removeSection(currentChapter.id, section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Content</Label>
                      <Textarea
                        placeholder="Enter content for this section. Lines starting with '-' or '*' will be treated as bullet points."
                        className="min-h-[120px] font-serif"
                        value={section.content}
                        onChange={(e) => updateSection(currentChapter.id, section.id, { content: e.target.value })}
                      />
                    </div>

                    {/* Diagrams/Figures */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Diagrams / Figures</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 bg-muted/5">
                        {section.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {section.images.map((img) => (
                              <div key={img.id} className="relative group">
                                <img 
                                  src={img.url} 
                                  alt={img.caption} 
                                  className="w-full h-32 object-cover rounded border"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImageFromSection(currentChapter.id, section.id, img.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                                <p className="text-xs text-center mt-1 truncate">{img.caption}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="w-10 h-10 text-muted-foreground" />
                          <span className="text-sm text-[#1a365d]">Add a diagram</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => triggerImageUpload(currentChapter.id, section.id)}
                          >
                            <Upload className="w-4 h-4" />
                            Upload image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Section Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed"
                  onClick={() => addSection(currentChapter.id)}
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </Button>

                {/* Delete Chapter Button */}
                {reportData.chapters.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        removeChapter(currentChapter.id);
                        setActiveChapter(reportData.chapters[0]?.id || '');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Chapter {currentChapter.number}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} className="gap-2 bg-[#1a365d] hover:bg-[#2d4a7c]">
          Preview Report
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
