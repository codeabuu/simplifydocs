import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [location.pathname]);

  if (location.pathname.startsWith("/dashboard")) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-5304301867905351"
      data-ad-slot="9787862628"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBanner;
