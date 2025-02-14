import React from "react";
import { MessageSquare, BarChart3, FileText, Upload, Users } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "AI-Powered Data Interaction",
    description: "Ask questions about your data and get instant answers.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Spreadsheet Chart Generation",
    description: "Upload spreadsheets and generate beautiful, interactive charts.",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "PDF Summarization",
    description: "Summarize long PDF documents in seconds.",
  },
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Seamless Uploads",
    description: "Easily upload spreadsheets (Excel, CSV) and PDFs.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Real-Time Collaboration",
    description: "Share insights and collaborate with your team.",
  },
];

const FeaturesSection = () => {
  return (
    <div id="features" className="py-24">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="gradient-text">What You Can Do</span>
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Transform your data analysis workflow with our powerful AI-driven tools
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-primary-500 mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;