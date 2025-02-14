import React from 'react';
import { CheckCircle2 } from 'lucide-react';

function Pricing() {
  const pricingTiers = [
    {
      name: "Try for Free",
      description: "For individuals and small projects.",
      price: "$0",
      period: "forever",
      features: [
        "10 uploads/month",
        "Basic AI features",
        "Limited chart generation",
        "Email support"
      ],
      cta: "Start for Free",
      highlighted: false
    },
    {
      name: "Monthly",
      description: "For professionals and teams.",
      price: "$49",
      period: "per month",
      features: [
        "100 uploads/month",
        "Advanced AI features",
        "Unlimited chart generation",
        "PDF summarization",
        "Priority support"
      ],
      cta: "Get Monthly",
      highlighted: true
    },
    {
      name: "Yearly",
      description: "For long-term savings.",
      price: "$499",
      period: "per year",
      features: [
        "100 uploads/month",
        "Advanced AI features",
        "Unlimited chart generation",
        "PDF summarization",
        "Priority support",
        "2 months free"
      ],
      cta: "Get Yearly",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Pricing Header */}
      <div className="hero-gradient py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            <span className="gradient-text">Simple and Transparent</span> Pricing
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include access to our core AI features.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="py-24 -mt-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  tier.highlighted
                    ? 'gradient-bg text-white shadow-xl scale-105'
                    : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className={tier.highlighted ? 'text-white/90' : 'text-gray-600'}>
                  {tier.description}
                </p>
                <div className="my-8">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  <span className={tier.highlighted ? 'text-white/90' : 'text-gray-600'}>
                    /{tier.period}
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle2 className={`w-5 h-5 mr-2 ${
                        tier.highlighted ? 'text-white' : 'text-primary-500'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-lg transition-all duration-300 ${
                    tier.highlighted
                      ? 'bg-white text-primary-500 hover:bg-primary-50'
                      : 'gradient-bg text-white hover:opacity-90'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="gradient-text">Frequently Asked Questions</span>
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-gray-600">Yes! You can change your plan at any time. When upgrading, you'll be prorated for the remainder of your billing period.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
            <p className="text-gray-600 mb-8">Our team is here to help you find the perfect plan for your needs.</p>
            <a href="mailto:support@lovable.ai" className="inline-flex items-center px-8 py-4 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-300">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;