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
    const lastPing = localStorage.getItem("lastBackendPing");
    const now = Date.now();

    const TEN_MINUTES = 10 * 60 * 1000;

    if (!lastPing || now - parseInt(lastPing, 10) > TEN_MINUTES) {
      fetch(`${API_BASE_URL}ping/`)
        .then(() => {
          console.log("Backend wake-up ping sent");
          localStorage.setItem("lastBackendPing", now.toString());
        })
        .catch((err) => {
          console.error("Ping failed:", err);
        });
      }else {
        console.log("Skipping backend ping, last ping was recent");
      }
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