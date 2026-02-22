import { FileText, GraduationCap, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'College-Approved Format',
      description: 'Exact formatting as per your college guidelines. No more faculty rejections.',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Pixel-Perfect PDF',
      description: 'A4 pages with correct margins, borders, fonts, and logo placements.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Content Generation',
      description: 'Generate chapter-wise content using AI or write manually.',
    },
  ];

  const checklist = [
    'Cover Page with logos',
    'Certificate & Declaration',
    'Project Approval Certificate',
    'Acknowledgement',
    'Abstract',
    'Table of Contents',
    'All 7 Chapters formatted',
    'References',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">For RGPV Engineering Students</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Project Report</span>
              <br />
              <span className="text-gradient">Generator</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate College-Approved Project Reports in Minutes. 
              Stop wasting hours on formatting. Focus on your content.
            </p>
            
            <Button 
              size="lg" 
              className="gradient-hero text-primary-foreground px-8 py-6 text-lg font-semibold shadow-elevated hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate('/create')}
            >
              Create Project Report
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              No signup required • Pay only ₹50 per report
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Students Love It</h2>
            <p className="text-muted-foreground">Faculty-ready reports in minutes, not days</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-xl shadow-card card-hover animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Complete Report Structure
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every page formatted exactly as per RGPV and college guidelines. 
                  Same fonts, same margins, same colors.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-card rounded-xl shadow-elevated p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="border-2 border-primary/20 p-4 bg-background rounded">
                    <div className="text-center mb-4">
                      <p className="text-accent font-bold text-sm">Major Project-I</p>
                      <p className="text-xs text-muted-foreground">Submitted in Fulfillment for the Award of</p>
                      <p className="text-primary font-bold text-xs">BACHELOR OF TECHNOLOGY</p>
                    </div>
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full mb-4 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      <p>Submitted to</p>
                      <p className="text-rgpv-blue font-semibold">RGPV, Bhopal</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Generate Your Report?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join hundreds of students who have already saved hours on formatting.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg font-semibold shadow-elevated hover:shadow-2xl transition-all duration-300"
            onClick={() => navigate('/create')}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">AI Project Report Generator</h3>
              <p className="text-sm text-muted-foreground">
                Generate college-approved, faculty-ready project reports for RGPV engineering students. Free manual reports & AI-powered generation at ₹50.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="/create" className="text-muted-foreground hover:text-primary transition-colors">Create Report</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">Refund & Cancellation Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AI Project Report Generator. Made for Engineering Students.</p>
            <p className="mt-1">Contact: <a href="mailto:developer.vishalshivhare123@gmail.com" className="text-primary hover:underline">developer.vishalshivhare123@gmail.com</a> | +91 8839801203</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
