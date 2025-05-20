import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { fetchSubscriptionPrices, startCheckout } from '@/lib/api';

function Pricing() {
  const [pricingTiers, setPricingTiers] = useState([]);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = new URLSearchParams(location.search).get('loggedIn') === 'true';

  // Fetch pricing data from the backend
  useEffect(() => {
    fetchSubscriptionPrices()
      .then(data => {
        const transformedData = data.map(tier => ({
          id: tier.id,
          name: tier.name,
          description: tier.description || "Best option for personal use & for your next project.",
          price: tier.price,
          period: tier.interval === "month" ? "per month" : "per year",
          features: [
            "Individual configuration",
            "No setup, or hidden fees",
            `Team size: ${tier.interval === "month" ? "1 developer" : "10 developers"}`,
            `Premium support: ${tier.interval === "month" ? "6 months" : "24 months"}`,
            `Free updates: ${tier.interval === "month" ? "6 months" : "24 months"}`,
          ],
          cta: tier.interval === "month" ? "Get Monthly" : "Get Yearly",
          highlighted: tier.interval === "month",
        }));
        setPricingTiers(transformedData);
      })
      .catch(error => console.error('Error fetching pricing data:', error));
  }, []);

  const handleCheckout = async (tierId: string) => {
    setLoadingTier(tierId);
    try {
      await startCheckout(tierId, navigate);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* X Button to Return to Dashboard (Only If Logged In) */}
      {isLoggedIn && (
        <button
          className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          onClick={() => navigate('/dashboard')}
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      )}
      
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
                  <span className="text-5xl font-bold">${tier.price}</span>
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
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loadingTier === tier.id}
                  className={`w-full py-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    tier.highlighted
                      ? 'bg-white text-primary-500 hover:bg-primary-50'
                      : 'gradient-bg text-white hover:opacity-90'
                  }`}
                >
                  {loadingTier === tier.id ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    tier.cta
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;