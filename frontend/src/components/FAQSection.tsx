import React from "react";

const faqs = [
  {
    question: "What file formats do you support?",
    answer: "We support Excel (.xlsx), CSV, and PDF files. More formats coming soon!",
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use enterprise-grade encryption and never store your data longer than necessary.",
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Absolutely! Our Pro and Enterprise plans include team collaboration features.",
  },
  {
    question: "How does the AI work?",
    answer: "Our AI uses advanced natural language processing to understand your questions and analyze your data.",
  },
];

const FAQSection = () => {
  return (
    <div className="py-24">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="gradient-text">Frequently Asked Questions</span>
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Find answers to common questions about our platform
        </p>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;