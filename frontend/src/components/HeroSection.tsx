import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BarChart3, ArrowDown, Sparkles, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden hero-gradient">
      <div className="max-w-[1920px] mx-auto">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-32 md:h-32 bg-primary-400/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 md:w-40 md:h-40 bg-secondary-400/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container min-h-screen flex items-center relative z-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-20">
            <div className="space-y-6">
              {/* Badge - reduced size */}
              <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-1.5" />
                <span className="text-xs md:text-sm font-medium">AI-Powered Data Analysis</span>
              </div>

              {/* Headline - scaled down */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                <span className="gradient-text">Transform</span> Your Data Into <span className="gradient-text">Actionable</span> Insights
              </h1>
              
              {/* Subheading - reduced size */}
              <p className="text-base md:text-lg text-gray-600 max-w-2xl">
                Instantly analyze spreadsheets, extract insights from PDFs, and generate beautiful visualizations—all powered by AI.
              </p>

              {/* Buttons - more compact */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-3">
                <Link
                  to="/signup"
                  className="px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center group font-medium shadow-md text-sm md:text-base"
                >
                  Get Started for Free
                  <ChevronRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="px-6 py-3 bg-white/90 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-white transition-all duration-300 text-center font-medium shadow-sm flex items-center justify-center text-sm md:text-base"
                >
                  See Premium Features
                </Link>
              </div>

              {/* Testimonials - scaled down */}
              <div className="flex items-center pt-6 space-x-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border-2 border-white overflow-hidden">
                        <img 
                          src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`} 
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Trusted by 5000+ data professionals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image section - scaled down */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <div className="absolute -bottom-6 -right-6 bg-white p-3 md:p-4 rounded-xl shadow-lg w-28 md:w-32 animate-float-delay-2">
                  <FileText className="w-6 h-6 md:w-7 md:h-7 text-secondary-500 mb-1" />
                  <p className="text-xs md:text-sm font-medium">PDF Processing</p>
                </div>
                
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  alt="Dashboard Preview"
                  className="rounded-2xl md:rounded-3xl shadow-xl border-4 md:border-6 border-white transform rotate-1 w-full max-w-[500px] mx-auto"
                />
                
                <div className="absolute -bottom-5 -right-5 bg-white p-3 rounded-lg shadow-md flex items-center">
                  <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-primary-500 mr-2" />
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500">Chart Generated</p>
                    <p className="text-sm md:text-base font-medium">Revenue Analysis</p>
                  </div>
                </div>
              </div>
              
              {/* Floating prompt - smaller */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="animate-bounce text-gray-500">
                  <ArrowDown className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500 mt-1">See how it works</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;