import React from "react";
import { Upload, MessageSquare, BarChart3, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Upload",
    description: "Upload your spreadsheet or PDF.",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Interact",
    description: "Ask questions or request summaries.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Visualize",
    description: "Generate charts and insights.",
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Share",
    description: "Export or share your results.",
  },
];

const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="gradient-text">How It Works</span>
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Get started in minutes with our simple four-step process
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                  <div className="text-primary-500">{step.icon}</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full">
                  <ArrowRight className="w-8 h-8 text-primary-300 mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;