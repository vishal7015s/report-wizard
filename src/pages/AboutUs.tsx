import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, Target, Eye } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">About Us</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Who We Are</h2>
            <p className="text-muted-foreground">
              AI Project Report Generator is a digital platform built specifically for engineering students affiliated with Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal. We help students create college-approved, faculty-ready project reports in minutes — saving hours of manual formatting work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Our Purpose</h2>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                Engineering students spend countless hours formatting their project reports — adjusting margins, placing logos, structuring chapters, and ensuring compliance with college guidelines. Our platform automates this entire process, allowing students to focus on their actual project work instead of formatting headaches.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">What We Offer</h2>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-2">
              <li><strong>Free Manual Report Creation:</strong> Students can enter their own content and generate a perfectly formatted report at no cost.</li>
              <li><strong>AI-Powered Report Generation:</strong> For ₹50, our AI generates chapter-wise content for your project report based on your project title and details.</li>
              <li><strong>College-Approved Format:</strong> Reports follow exact RGPV and affiliated college guidelines — correct fonts, margins, logos, borders, and page structure.</li>
              <li><strong>Instant Download:</strong> Download your report in PDF and DOCX formats immediately after generation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Our Mission</h2>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                To empower every RGPV engineering student with tools that simplify academic documentation, so they can dedicate more time to learning and building real-world projects.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Our Vision</h2>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                To become the go-to platform for academic report generation across all Indian universities, helping millions of students produce professional-quality documentation effortlessly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Business Details</h2>
            <div className="bg-muted/50 rounded-lg p-4 mt-2">
              <ul className="text-muted-foreground space-y-2">
                <li><strong>Business Name:</strong> AI Project Report Generator</li>
                <li><strong>Type:</strong> Sole Proprietorship</li>
                <li><strong>Operating Since:</strong> 2024</li>
                <li><strong>Location:</strong> Madhya Pradesh, India</li>
                <li><strong>Industry:</strong> EdTech / Digital Services</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
