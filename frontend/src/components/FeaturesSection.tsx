import React from "react";
import { 
  Zap,
  BarChart3,
  FileSearch,
  Sparkles,
  Database,
  ClipboardCheck
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant AI Insights",
    description: "Ask natural language questions about your data and get accurate answers in seconds",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Smart Chart Generation",
    description: "Automatically create publication-ready visualizations from spreadsheet data",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: "Advanced PDF Analysis",
    description: "Extract and analyze data from PDFs, including tables and complex documents",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Automated Summaries",
    description: "Get concise executive summaries of lengthy reports and datasets",
    gradient: "from-violet-500 to-fuchsia-500"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Data Transformation",
    description: "Clean, organize, and transform raw data into analysis-ready formats",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "Automated Report Generation",
    description: "Create polished, formatted reports with insights and visualizations in multiple formats",
    gradient: "from-rose-500 to-red-500"
  }
];

const FeaturesSection = () => {
  return (
    <div id="features" className="py-16 md:py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">Supercharge</span> Your Data Workflow
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how AskAnalytIQ transforms raw data into actionable intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              
              {/* Icon with gradient background */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-gradient-to-r ${feature.gradient} text-white`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
              
              {/* Hover effect element */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Stats section - scaled down */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-primary-500 mb-1">10x</div>
            <p className="text-gray-600 text-sm">Faster analysis</p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary-500 mb-1">100+</div>
            <p className="text-gray-600 text-sm">Chart types</p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary-500 mb-1">24/7</div>
            <p className="text-gray-600 text-sm">AI assistance</p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary-500 mb-1">4.9★</div>
            <p className="text-gray-600 text-sm">Rated by users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;