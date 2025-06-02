import React from "react";
import { Upload, MessageSquare, BarChart3, Share2, ArrowRight, Zap } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Upload Your Files",
    description: "Drag and drop spreadsheets (CSV, Excel) or PDF documents",
    accentColor: "bg-blue-100 text-blue-600"
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Ask Your Questions",
    description: "Get instant answers about your data in natural language",
    accentColor: "bg-purple-100 text-purple-600"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Discover Insights",
    description: "Automatically generate visualizations and key findings",
    accentColor: "bg-amber-100 text-amber-600"
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Export Results",
    description: "Download reports or share directly with your team",
    accentColor: "bg-emerald-100 text-emerald-600"
  }
];

const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Lightning Fast Setup
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Simple</span> Four-Step Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your data into actionable insights in minutes, not hours
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
              >
                <div className={`w-12 h-12 ${step.accentColor} rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
                  {step.icon}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 mr-2">Step {index + 1}</span>
                  <div className="w-4 h-px bg-gray-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-gray-400 transition-colors" />
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