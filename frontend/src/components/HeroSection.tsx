import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BarChart3, ArrowDown, Sparkles, FileText, FileSpreadsheet } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden hero-gradient">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-secondary-400/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container min-h-screen flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium">AI-Powered Data Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="gradient-text">Transform</span> Your Data Into <span className="gradient-text">Actionable</span> Insights
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl">
              Instantly analyze spreadsheets, extract insights from PDFs, and generate beautiful visualizations—all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                to="/signup"
                className="px-8 py-4 gradient-bg text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group font-medium shadow-md"
              >
                Get Started for Free
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/90 border-2 border-primary-500 text-primary-600 rounded-xl hover:bg-white transition-all duration-300 text-center font-medium shadow-sm flex items-center justify-center"
              >
                See Premium Features
              </Link>
            </div>

            <div className="flex items-center pt-8 space-x-6">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="w-10 h-10 rounded-full bg-white border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`} 
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Trusted by 5000+ data professionals</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Dashboard mockup with floating elements */}
            <div className="relative z-10">
              {/* <div className="absolute -top-8 -left-8 bg-white p-5 rounded-2xl shadow-xl w-32 animate-float-delay-1"> */}
                {/* <FileSpreadsheet className="w-8 h-8 text-primary-500 mb-2" /> */}
                {/* <p className="text-sm font-medium">Spreadsheet Analysis</p> */}
              {/* </div> */}
              
              <div className="absolute -bottom-8 -right-8 bg-white p-5 rounded-2xl shadow-xl w-32 animate-float-delay-2">
                <FileText className="w-8 h-8 text-secondary-500 mb-2" />
                <p className="text-sm font-medium">PDF Processing</p>
              </div>
              
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                alt="Dashboard Preview"
                className="rounded-3xl shadow-2xl border-8 border-white transform rotate-1"
              />
              
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-lg flex items-center">
                <BarChart3 className="w-10 h-10 text-primary-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Chart Generated</p>
                  <p className="font-medium">Revenue Analysis</p>
                </div>
              </div>
            </div>
            
            {/* Floating animation prompt */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="animate-bounce text-gray-500">
                <ArrowDown className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-500 mt-2">See how it works</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;