import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TrustLogos from '@/components/landing/TrustLogos';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import ComparisonTable from '@/components/landing/ComparisonTable';
import SamplesPreview from '@/components/landing/SamplesPreview';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/landing/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import SecuritySection from '@/components/landing/SecuritySection';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustLogos />
      <HowItWorks />
      <FeaturesGrid />
      <ComparisonTable />
      <SamplesPreview />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <SecuritySection />
      <Footer />
    </div>
  );
};

export default LandingPage;
