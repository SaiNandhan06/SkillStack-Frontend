import { useState } from "react";
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import StatsBar from "./landing/StatsBar";
import Features from "./landing/Features";
import Testimonials from "./landing/Testimonials";
import Pricing from "./landing/Pricing";
import FAQ from "./landing/FAQ";
import FinalCTA from "./landing/FinalCTA";
import Footer from "./landing/Footer";
import DemoModal from "./landing/DemoModal";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCTAClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-body">
      <Navbar onCTAClick={handleCTAClick} />
      <Hero onCTAClick={handleCTAClick} />
      <StatsBar />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA onCTAClick={handleCTAClick} />
      <Footer />
      <DemoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Home;
