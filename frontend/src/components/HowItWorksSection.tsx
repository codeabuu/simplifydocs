import React from "react";
import { Upload, MessageSquare, BarChart3, Share2, ArrowRight, Zap } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Upload Your Files",
    description: "Drag and drop spreadsheets (CSV, Excel) or PDF documents",
    accentColor: "bg-blue-100 text-blue-600"
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Ask Your Questions",
    description: "Get instant answers about your data in natural language",
    accentColor: "bg-purple-100 text-purple-600"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Discover Insights",
    description: "Automatically generate visualizations and key findings",
    accentColor: "bg-amber-100 text-amber-600"
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Export Results",
    description: "Download reports or share directly with your team",
    accentColor: "bg-emerald-100 text-emerald-600"
  }
];

const HowItWorksSection = () => {
  return (
    <div className="py-16 md:py-4 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-primary-100 rounded-full text-primary-600 text-xs font-medium mb-3">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Lightning Fast Setup
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">Simple</span> Four-Step Process
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your data into actionable insights in minutes, not hours
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
              >
                <div className={`w-10 h-10 ${step.accentColor} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105`}>
                  {step.icon}
                </div>
                <div className="flex items-center mb-1.5">
                  <span className="text-xs font-medium text-gray-500 mr-1.5">Step {index + 1}</span>
                  <div className="w-3 h-px bg-gray-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    {/* <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" /> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;