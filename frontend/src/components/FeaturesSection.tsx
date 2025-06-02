import React from "react";
import { 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Upload, 
  Users,
  Zap,
  PieChart,
  FileSearch,
  Database,
  Sparkles,
  ClipboardCheck
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant AI Insights",
    description: "Ask natural language questions about your data and get accurate answers in seconds",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Smart Chart Generation",
    description: "Automatically create publication-ready visualizations from spreadsheet data",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <FileSearch className="w-8 h-8" />,
    title: "Advanced PDF Analysis",
    description: "Extract and analyze data from PDFs, including tables and complex documents",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Automated Summaries",
    description: "Get concise executive summaries of lengthy reports and datasets",
    gradient: "from-violet-500 to-fuchsia-500"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Data Transformation",
    description: "Clean, organize, and transform raw data into analysis-ready formats",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: <ClipboardCheck className="w-8 h-8" />,
    title: "Automated Report Generation",
    description: "Create polished, formatted reports with insights and visualizations in multiple formats",
    gradient: "from-rose-500 to-red-500"
  }
];

const FeaturesSection = () => {
  return (
    <div id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Supercharge</span> Your Data Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how AskAnalytIQ transforms raw data into actionable intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              
              {/* Icon with gradient background */}
              <div className={`w-14 h-14 flex items-center justify-center rounded-xl mb-6 bg-gradient-to-r ${feature.gradient} text-white`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
              
              {/* Hover effect element */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary-500 mb-2">10x</div>
            <p className="text-gray-600">Faster analysis</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary-500 mb-2">100+</div>
            <p className="text-gray-600">Chart types</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary-500 mb-2">24/7</div>
            <p className="text-gray-600">AI assistance</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary-500 mb-2">4.9★</div>
            <p className="text-gray-600">Rated by users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;