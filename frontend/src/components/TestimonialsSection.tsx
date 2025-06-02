import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AskAnalytIQ has revolutionized our data workflow. What used to take hours now takes minutes with their AI-powered analysis.",
    author: "Dr. Sarah Chen",
    role: "Lead Data Scientist, TechCorp",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
  {
    quote: "The automated chart generation produces publication-ready visuals that impress our clients. It's become an indispensable tool for our analytics team.",
    author: "Michael Rodriguez",
    role: "Director of Analytics, Finova",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
  {
    quote: "As a researcher, the PDF summarization feature saves me 10+ hours weekly. The accuracy of extracted data is remarkable.",
    author: "Priya Patel",
    role: "Senior Researcher, Stanford University",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="gradient-text">Data Professionals</span> Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join 5,000+ teams who have transformed their data workflow with AskAnalytIQ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden"
            >
              {/* Decorative quote icon */}
              <Quote className="absolute -top-4 -right-4 w-24 h-24 text-gray-100 group-hover:text-gray-200 transition-colors duration-300 -z-10" />
              
              {/* Rating stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-8 text-lg relative z-10">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm mb-6">
            TRUSTED BY TEAMS AT
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {['TechCorp', 'Finova', 'Stanford', 'DataWorks', 'AnalyticsPro'].map((company, i) => (
              <div key={i} className="text-xl font-medium text-gray-700">
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