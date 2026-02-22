import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import TrustLogos from '@/components/landing/TrustLogos';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import ComparisonTable from '@/components/landing/ComparisonTable';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Security from '@/components/landing/Security';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustLogos />
      <HowItWorks />
      <Features />
      <ComparisonTable />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Security />
      <Footer />
    </div>
  );
};

export default LandingPage;
