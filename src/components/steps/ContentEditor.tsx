import { useState, useRef } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handlePasteFormat, formatOnChange } from '@/lib/formatContent';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { 
  Sparkles, 
  PenLine, 
  Plus, 
  Trash2, 
  ArrowRight,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  Wand2,
  Lock
} from 'lucide-react';

const ContentEditor = () => {
  const { 
    contentMode, 
    setContentMode, 
    reportData, 
    aiReportContent,
    isAIGenerated,
    setIsAIGenerated,
    setAiPrompt,
    setAbstract,
    setAcknowledgement,
    setAiChapters,
    setAiAbstract,
    setAiAcknowledgement,
    addChapter,
    removeChapter,
    addSection,
    removeSection,
    updateSection,
    addImageToSection,
    removeImageFromSection,
    addImageToAiSection,
    removeImageFromAiSection,
    setCurrentStep,
    setChapters
  } = useReportStore();
  
  const [aiPromptText, setAiPromptText] = useState('');
  const [activeChapter, setActiveChapter] = useState(reportData.chapters[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSectionForImage, setCurrentSectionForImage] = useState<{chapterId: string, sectionId: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState<string | null>(null);
  const { isPaid } = useRazorpayPayment();
  // Use appropriate chapters based on content mode
  const activeChapters = contentMode === 'ai' ? aiReportContent.chapters : reportData.chapters;

  // Count total AI-generated diagrams across AI chapters
  const totalAIDiagrams = aiReportContent.chapters.reduce((total, chapter) => {
    return total + chapter.sections.reduce((sectionTotal, section) => {
      return sectionTotal + (section.images?.filter(img => img.id.startsWith('ai-diagram-')).length || 0);
    }, 0);
  }, 0);

  const MAX_AI_DIAGRAMS = 5;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentSectionForImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const image = {
          id: Date.now().toString(),
          url: imageUrl,
          caption: file.name.replace(/\.[^/.]+$/, '')
        };
        if (contentMode === 'ai') {
          addImageToAiSection(currentSectionForImage.chapterId, currentSectionForImage.sectionId, image);
        } else {
          addImageToSection(currentSectionForImage.chapterId, currentSectionForImage.sectionId, image);
        }
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

  const handleGenerateContent = async () => {
    if (!aiPromptText.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    if (aiPromptText.trim().length < 50) {
      toast.error('Please provide a more detailed description (at least 50 characters)');
      return;
    }

    setIsGenerating(true);
    toast.info('Generating preview content... This may take a moment.');

    try {
      const { data, error } = await supabase.functions.invoke('generate-report-content', {
        body: {
          prompt: aiPromptText,
          projectTitle: reportData.projectDetails.projectTitle,
          guideName: reportData.projectDetails.guideName,
          students: reportData.projectDetails.students,
          branch: reportData.projectDetails.branch,
          projectType: reportData.projectDetails.projectType,
          mode: 'preview'
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update AI report content (separate from manual)
      setAiAbstract(data.abstract);
      setAiAcknowledgement(data.acknowledgement);
      setAiChapters(data.chapters);
      setActiveChapter(data.chapters[0]?.id || '');
      setIsAIGenerated(true);
      setAiPrompt(aiPromptText); // Save prompt for full generation after payment

      toast.success('Preview content generated! Pay to unlock full report with all 7 chapters.');
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDiagram = async (chapterId: string, sectionId: string, diagramType: string) => {
    // Check if limit reached
    if (totalAIDiagrams >= MAX_AI_DIAGRAMS) {
      toast.error(`Maximum ${MAX_AI_DIAGRAMS} AI-generated diagrams allowed per report`);
      return;
    }

    const section = reportData.chapters.find(c => c.id === chapterId)?.sections.find(s => s.id === sectionId);
    if (!section) return;

    setIsGeneratingDiagram(`${chapterId}-${sectionId}-${diagramType}`);
    toast.info(`Generating ${diagramType.replace(/-/g, ' ')} diagram... (${totalAIDiagrams + 1}/${MAX_AI_DIAGRAMS})`);

    try {
      const { data, error } = await supabase.functions.invoke('generate-diagram', {
        body: {
          diagramType,
          projectContext: `${reportData.projectDetails.projectTitle}. ${section.heading}: ${section.content.substring(0, 500)}`
        }
      });

      if (error) {
        console.error('Diagram error:', error);
        throw new Error(error.message || 'Failed to generate diagram');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      addImageToSection(chapterId, sectionId, {
        id: `ai-diagram-${Date.now()}`,
        url: data.imageUrl,
        caption: data.caption
      });

      toast.success(`Diagram generated! (${totalAIDiagrams + 1}/${MAX_AI_DIAGRAMS} used)`);
      
    } catch (error) {
      console.error('Diagram generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate diagram');
    } finally {
      setIsGeneratingDiagram(null);
    }
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  const currentChapter = activeChapters.find(c => c.id === activeChapter);

  const diagramOptions = [
    { type: 'er-diagram', label: 'ER Diagram' },
    { type: 'flowchart', label: 'Flowchart' },
    { type: 'architecture', label: 'Architecture' },
    { type: 'dfd', label: 'DFD' },
    { type: 'use-case', label: 'Use Case' },
  ];

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
            AI Generate (Free)
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <PenLine className="w-4 h-4" />
            Manual Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-[#1a365d]">Describe Your Project</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a detailed description of your project. AI will generate content for all chapters including abstract, acknowledgement, and technical details.
                </p>
              </div>
              <Textarea
                placeholder="Example: My project is about predicting multiple diseases using machine learning. The system uses patient health parameters like blood pressure, glucose levels, cholesterol, BMI, and age to predict the likelihood of heart disease and diabetes. We implemented Logistic Regression, SVM, Random Forest, and KNN algorithms. The frontend is built with React and backend uses Python Flask with MySQL database..."
                className="min-h-[200px] font-serif"
                value={aiPromptText}
                onChange={(e) => setAiPromptText(e.target.value)}
                disabled={isGenerating}
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={aiPromptText.length < 50 ? 'text-destructive' : 'text-green-600'}>
                  {aiPromptText.length} characters
                </span>
                <span>(minimum 50 required)</span>
              </div>
              <Button 
                className="w-full gap-2 bg-[#1a365d] hover:bg-[#2d4a7c]" 
                onClick={handleGenerateContent}
                disabled={isGenerating || aiPromptText.length < 50}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Preview Report
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                AI will generate a preview with Abstract, Acknowledgement, and 3 Chapters. Full 7-chapter report unlocks after payment (₹50).
              </p>
            </div>
          </div>

          {/* Tips for better generation */}
          <div className="bg-muted/50 rounded-xl border p-4">
            <h4 className="font-semibold text-[#1a365d] mb-2">Tips for Better Results</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include the technologies you're using (React, Python, MySQL, etc.)</li>
              <li>• Mention the problem your project solves</li>
              <li>• Describe key features and modules</li>
              <li>• Include any algorithms or methodologies used</li>
              <li>• Mention target users or audience</li>
            </ul>
          </div>

          {/* AI Diagram Generation - Only shown after content is generated */}
          {aiReportContent.chapters.some(c => c.sections.some(s => s.content.length > 0)) && (
            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold text-[#1a365d]">Generate AI Diagrams</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add diagrams to your report sections (max {MAX_AI_DIAGRAMS} diagrams)
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${totalAIDiagrams >= MAX_AI_DIAGRAMS ? 'text-destructive' : 'text-green-600'}`}>
                    {totalAIDiagrams}/{MAX_AI_DIAGRAMS} used
                  </span>
                </div>

                {/* Chapter Selection for Diagrams */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {aiReportContent.chapters.map((chapter) => (
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
                        Ch. {chapter.number}
                      </Button>
                    ))}
                  </div>

                  {currentChapter && (
                    <div className="space-y-3">
                      {currentChapter.sections.map((section) => (
                        <div key={section.id} className="p-4 border rounded-lg bg-muted/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-sm text-[#1a365d]">
                              {section.number} {section.heading}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {section.images?.length || 0} image(s)
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {/* Upload Image - always active */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs"
                              onClick={() => triggerImageUpload(currentChapter.id, section.id)}
                            >
                              <Upload className="w-3 h-3" />
                              Upload Image
                            </Button>

                            {/* AI Diagram buttons - locked until payment */}
                            {diagramOptions.map(opt => (
                              <Button
                                key={opt.type}
                                variant="outline"
                                size="sm"
                                className={`gap-1 text-xs ${!isPaid ? 'opacity-50' : ''}`}
                                onClick={() => handleGenerateDiagram(currentChapter.id, section.id, opt.type)}
                                disabled={!isPaid || isGeneratingDiagram === `${currentChapter.id}-${section.id}-${opt.type}` || totalAIDiagrams >= MAX_AI_DIAGRAMS}
                              >
                                {isGeneratingDiagram === `${currentChapter.id}-${section.id}-${opt.type}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : !isPaid ? (
                                  <Lock className="w-3 h-3" />
                                ) : (
                                  <Wand2 className="w-3 h-3" />
                                )}
                                {opt.label}
                              </Button>
                            ))}
                          </div>
                          {!isPaid && (
                            <p className="text-xs text-muted-foreground mt-2">
                              🔒 AI diagram generation unlocks after payment. You can upload your own images now.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          {/* Abstract */}
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <Label className="text-base font-semibold text-[#1a365d]">Abstract</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              A brief summary of your project (150-300 words)
            </p>
            <Textarea
              placeholder="Write your project abstract here... (Paste from ChatGPT - auto-formatted!)"
              className="min-h-[150px] font-serif"
              value={reportData.abstract}
              onChange={(e) => {
                const { newValue } = formatOnChange(e.target.value, reportData.abstract, e.target.selectionStart);
                setAbstract(newValue);
              }}
              onPaste={(e) => handlePasteFormat(e, reportData.abstract, setAbstract)}
            />
          </div>

          {/* Acknowledgement */}
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <Label className="text-base font-semibold text-[#1a365d]">Acknowledgement</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Thank your guides, HOD, principal, and others
            </p>
            <Textarea
              placeholder="Write your acknowledgement here... (Paste from ChatGPT - auto-formatted!)"
              className="min-h-[150px] font-serif"
              value={reportData.acknowledgement}
              onChange={(e) => {
                const { newValue } = formatOnChange(e.target.value, reportData.acknowledgement, e.target.selectionStart);
                setAcknowledgement(newValue);
              }}
              onPaste={(e) => handlePasteFormat(e, reportData.acknowledgement, setAcknowledgement)}
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
                        placeholder="Enter content for this section. Paste from ChatGPT - bullet points auto-formatted!"
                        className="min-h-[120px] font-serif"
                        value={section.content}
                        onChange={(e) => {
                          const { newValue } = formatOnChange(e.target.value, section.content, e.target.selectionStart);
                          updateSection(currentChapter.id, section.id, { content: newValue });
                        }}
                        onPaste={(e) => handlePasteFormat(e, section.content, (value) => updateSection(currentChapter.id, section.id, { content: value }))}
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
                        
                        <div className="flex flex-col items-center gap-3">
                          <ImageIcon className="w-10 h-10 text-muted-foreground" />
                          <span className="text-sm text-[#1a365d]">Add a diagram</span>
                          
                          {/* Show AI diagram buttons only for AI-generated content */}
                          {isAIGenerated && section.content.length > 0 && (
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-muted-foreground">
                                  Generate AI diagrams ({totalAIDiagrams}/{MAX_AI_DIAGRAMS})
                                </p>
                                <span className={`text-xs font-medium ${totalAIDiagrams >= MAX_AI_DIAGRAMS ? 'text-destructive' : 'text-green-600'}`}>
                                  {MAX_AI_DIAGRAMS - totalAIDiagrams} left
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 justify-center">
                                {diagramOptions.map(opt => (
                                  <Button
                                    key={opt.type}
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-xs"
                                    onClick={() => handleGenerateDiagram(currentChapter.id, section.id, opt.type)}
                                    disabled={isGeneratingDiagram === `${currentChapter.id}-${section.id}-${opt.type}` || totalAIDiagrams >= MAX_AI_DIAGRAMS}
                                  >
                                    {isGeneratingDiagram === `${currentChapter.id}-${section.id}-${opt.type}` ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Wand2 className="w-3 h-3" />
                                    )}
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                              <div className="my-3 flex items-center gap-2">
                                <div className="flex-1 h-px bg-border"></div>
                                <span className="text-xs text-muted-foreground">or</span>
                                <div className="flex-1 h-px bg-border"></div>
                              </div>
                            </div>
                          )}

                          {!isAIGenerated && (
                            <p className="text-xs text-muted-foreground text-center">
                              Upload your own diagrams or use AI Generate tab for auto-generated diagrams
                            </p>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => triggerImageUpload(currentChapter.id, section.id)}
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image
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
