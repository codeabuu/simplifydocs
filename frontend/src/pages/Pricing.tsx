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

  useEffect(() => {
    fetchSubscriptionPrices()
      .then(data => {
        const transformedData = data.map(tier => {
          const isYearly = tier.interval === "year";
          const baseFeatures = [
            <span key="analysis"><strong>Unlimited</strong> spreadsheet & PDF analysis</span>,
            <span key="charts"><strong>Advanced</strong> chart generation (70+ chart types)</span>,
            <span key="updates"><strong>Early access</strong> to new features</span>
          ];

          return {
            id: tier.id,
            name: isYearly ? "Yearly Plan" : "Monthly Plan",
            description: isYearly 
              ? "Best for professionals & power users (Save 16% vs monthly)"
              : "Best for trying out the platform",
            price: tier.price,
            period: isYearly ? "per year" : "per month",
            features: isYearly
              ? [
                  ...baseFeatures,
                  <span key="priority"><strong>Priority</strong> AI processing</span>,
                  <span key="support"><strong>Dedicated</strong> 24/7 support</span>,
                ]
              : [
                  ...baseFeatures,
                  <span key="standard"><strong>Standard</strong> AI processing</span>,
                ],
            cta: isYearly ? "Get Yearly" : "Get Monthly",
            highlighted: isYearly,
            isYearly
          };
        });
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
      {/* Close Button */}
      {isLoggedIn && (
        <button
          className="absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full shadow-sm hover:bg-gray-200 transition"
          onClick={() => navigate('/dashboard')}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      )}
      
      {/* Pricing Header */}
      <div className="hero-gradient py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Simple and Transparent</span> Pricing
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include access to our core AI features.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="py-16 md:py-20 -mt-16 md:-mt-20">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                  tier.highlighted
                    ? 'gradient-bg text-white shadow-lg border-primary-500'
                    : 'bg-white text-gray-900 shadow-md hover:shadow-lg border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-1.5">{tier.name}</h3>
                <p className={`text-sm ${tier.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
                
                <div className="my-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className={tier.highlighted ? 'text-white/90' : 'text-gray-600'}>
                    /{tier.period}
                  </span>
                  {tier.isYearly && (
                    <div className="text-xs mt-1 text-primary-200">
                      ≈ ${Math.round(tier.price / 12 * 100) / 100}/month
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={`${tier.id}-${featureIndex}`} className="flex items-start">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${
                        tier.highlighted ? 'text-white' : 'text-primary-500'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loadingTier === tier.id}
                  className={`w-full py-2.5 rounded-md transition-all duration-300 flex items-center justify-center font-medium text-sm ${
                    tier.highlighted
                      ? 'bg-white text-primary-600 hover:bg-primary-50'
                      : 'gradient-bg text-white hover:opacity-90'
                  }`}
                >
                  {loadingTier === tier.id ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
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
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Need more? <button className="text-primary-500 hover:underline" onClick={() => navigate('/contact')}>Contact us</button> for enterprise solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;