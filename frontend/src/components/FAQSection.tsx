import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What file formats do you support for analysis?",
    answer: "AskAnalytIQ currently supports Excel (.xlsx, .xls), CSV files for spreadsheet analysis, and PDF documents for text extraction and summarization. We're actively working to add more formats in future updates.",
    category: "Technical"
  },
  {
    question: "How do you ensure my data privacy and security?",
    answer: "We employ multiple security measures including: \n\n• End-to-end encryption for all file transfers\n• SOC 2 Type II compliant infrastructure\n• Automatic data purging after processing\n• Strict access controls and audit logging\n\nYour data is never used for training our AI models or shared with third parties.",
    category: "Security"
  },
  {
    question: "What makes your AI analysis different?",
    answer: "Our AI combines:\n\n• Natural language understanding for plain English queries\n• Statistical analysis for pattern detection\n• Machine learning for contextual insights\n• Visualization intelligence for automatic chart selection\n\nThis creates human-like analysis at machine speed.",
    category: "Technical"
  },
  {
    question: "Do you offer team or enterprise plans?",
    answer: "Yes! We offer:\n\n• Team plans with shared workspaces and collaborative features\n• Enterprise solutions with custom SLAs and dedicated support\n• Volume discounts for large organizations\n\nContact our sales team for a customized proposal.",
    category: "Pricing"
  },
  {
    question: "How accurate are your PDF text extractions?",
    answer: "Our proprietary extraction engine achieves:\n\n• 99%+ accuracy for digital PDFs\n• 95%+ for scanned documents (with OCR)\n• 98%+ for tabular data extraction\n\nWe continuously improve our algorithms based on user feedback.",
    category: "Technical"
  },
  {
    question: "What support options are available?",
    answer: "We provide:\n\n• 24/7 email support with <2 hour response times\n• Detailed documentation and tutorials\n• Live chat support during business hours (Pro plan)\n• Dedicated account managers (Enterprise)\n\nPlus an active community forum for peer support.",
    category: "Support"
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = filter === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === filter);

  const categories = ["All", ...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">FAQs</span> & Support
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about AskAnalytIQ
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 ${
                activeIndex === index ? 'shadow-md' : 'hover:shadow-md'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary-500 mr-4 mt-1 flex-shrink-0" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 ml-4" />
                )}
              </button>
              
              <div
                className={`px-6 pb-6 pl-16 transition-all duration-300 ${
                  activeIndex === index ? 'block' : 'hidden'
                }`}
              >
                {faq.answer.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Still have questions? We're here to help.
          </p>
          <button className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;