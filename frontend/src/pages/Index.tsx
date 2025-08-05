import React, {useEffect} from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const Index = () => {
  useEffect(() => {
    fetch(`${API_BASE_URL}ping/`)
      .then(() => {
        console.log("Backend wake-up ping sent");
      })
      .catch((err) => {
        console.error("Ping failed:", err);
      });
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;