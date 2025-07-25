import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://simpai.fly.dev/';

const CheckoutStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}checkout/start/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
          maxRedirects: 0, // Prevent auto-redirect
          validateStatus: (status) => status >= 200 && status < 400, // Allow handling redirects
        });

        console.log("✅ Checkout response:", response.data);

        if (response.data.checkout_url) {
          console.log("✅ Redirecting to checkout:", response.data.checkout_url);
          window.location.href = response.data.checkout_url;
        } else {
          console.error("❌ No checkout URL found in response.");
          navigate('/pricing');
        }

      } catch (error) {
        console.error('❌ Error fetching checkout URL:', error);
        navigate('/pricing');
      }
    };

    fetchCheckoutUrl();
  }, [navigate]);

  return <div>Redirecting to checkout...</div>;
};

export default CheckoutStart;
