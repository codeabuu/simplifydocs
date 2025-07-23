import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AskAnalytIQ has revolutionized our data workflow. What used to take hours now takes minutes with their AI-powered analysis.",
    author: "Dr. Sarah Chen",
    role: "Lead Data Scientist, TechCorp",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 5
  },
  {
    quote: "The automated chart generation produces publication-ready visuals that impress our clients. It's become an indispensable tool for our analytics team.",
    author: "Michael Rodriguez",
    role: "Director of Analytics, Finova",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 5
  },
  {
    quote: "As a researcher, the PDF summarization feature saves me 10+ hours weekly. The accuracy of extracted data is remarkable.",
    author: "Priya Patel",
    role: "Senior Researcher, Stanford University",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <div className="py-16 md:py-10 bg-gradient-to-b from-white to-gray-50/50">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Trusted by <span className="gradient-text">Data Professionals</span> Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 5,000+ teams who have transformed their data workflow with AskAnalytIQ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group relative overflow-hidden"
            >
              {/* Decorative quote icon */}
              <Quote className="absolute -top-3 -right-3 w-16 h-16 text-gray-100 group-hover:text-gray-200 transition-colors duration-300 -z-10" />
              
              {/* Rating stars */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-6 text-base relative z-10">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.author}</p>
                  <p className="text-gray-600 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-xs mb-4">
            TRUSTED BY TEAMS AT
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-70">
            {['TechCorp', 'Finova', 'Stanford', 'DataWorks', 'AnalyticsPro'].map((company, i) => (
              <div key={i} className="text-base font-medium text-gray-700">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;