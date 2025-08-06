import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  canonicalUrl?: string;
}

const Layout = ({ 
  children,
  pageTitle = "DocuAI | AI-Powered Spreadsheet & PDF Analysis",
  pageDescription = "Chat with your spreadsheets, generate charts, and summarize PDFs using AI",
  canonicalUrl = "https://yourdomain.com"
}: LayoutProps) => {
  
  // Schema.org structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DocuAI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": "Spreadsheet analysis, Chart generation, PDF summarization"
  };

  return (
    <div>
      {/* SEO Head Elements */}
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="spreadsheet analysis, chart generator, PDF summarizer, AI document tool" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Social Meta */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </head>

      <Navbar />
      <main itemScope itemType="https://schema.org/WebApplication">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;