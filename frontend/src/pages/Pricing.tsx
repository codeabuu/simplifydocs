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
                  // <span key="team"><strong>Team</strong> collaboration (up to 5 members)</span>,
                  <span key="support"><strong>Dedicated</strong> 24/7 support</span>,
                  // <span key="history"><strong>Extended</strong> chat history (12 months)</span>
                ]
              : [
                  ...baseFeatures,
                  <span key="standard"><strong>Standard</strong> AI processing</span>,
                  // <span key="limit"><strong>100</strong> analyses/month</span>,
                  // <span key="history"><strong>30-day</strong> chat history</span>
                ],
            cta: isYearly ? "Get Yearly" : "Get Monthly",
            highlighted: isYearly, // Now highlighting yearly plan
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                  tier.highlighted
                    ? 'gradient-bg text-white shadow-xl border-primary-500 scale-[1.02]'
                    : 'bg-white text-gray-900 shadow-lg hover:shadow-xl border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className={tier.highlighted ? 'text-white/90' : 'text-gray-600'}>
                  {tier.description}
                </p>
                
                <div className="my-6">
                  <span className="text-5xl font-bold">${tier.price}</span>
                  <span className={tier.highlighted ? 'text-white/90' : 'text-gray-600'}>
                    /{tier.period}
                  </span>
                  {tier.isYearly && (
                    <div className="text-sm mt-1 text-primary-200">
                      ≈ ${Math.round(tier.price / 12 * 100) / 100}/month
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={`${tier.id}-${featureIndex}`} className="flex items-start">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 ${
                        tier.highlighted ? 'text-white' : 'text-primary-500'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loadingTier === tier.id}
                  className={`w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-medium ${
                    tier.highlighted
                      ? 'bg-white text-primary-600 hover:bg-primary-50'
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
          
          <div className="mt-12 text-center text-gray-500">
            <p>Need more? <button className="text-primary-500 hover:underline" onClick={() => navigate('/contact')}>Contact us</button> for enterprise solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;