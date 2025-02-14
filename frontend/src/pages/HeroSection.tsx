import React from "react";
import { ChevronRight } from "lucide-react";
import { BarChart3 } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="hero-gradient">
      <div className="container min-h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="gradient-text">Unlock</span> the Power of AI for Your Data
            </h1>
            <p className="text-xl text-gray-600">
              Upload spreadsheets and PDFs, ask questions, generate charts, and summarize documents—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-4 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group">
                Get Started for Free
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="/pricing" 
                className="px-8 py-4 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-all duration-300 text-center"
              >
                View Pricing
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 animate-float">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                alt="Dashboard Preview"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                <BarChart3 className="w-12 h-12 text-primary-500" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;