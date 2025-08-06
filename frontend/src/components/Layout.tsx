import { ReactNode } from "react";
import { Helmet } from "react-helmet"; // Install via: npm install react-helmet

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  canonicalUrl?: string;
}

const Layout = ({ 
  children,
  pageTitle = "AI Spreadsheet & PDF Analysis | DocuAI",
  pageDescription = "Chat with spreadsheets, generate charts, and summarize PDFs using AI",
  canonicalUrl = "https://yourdomain.com"
}: LayoutProps) => {
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DocuAI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "featureList": "Spreadsheet analysis, Chart generation, PDF summarization"
  };

  return (
    <>
      <Helmet>
        {/* Dynamic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* <Navbar />
      <main itemScope itemType="https://schema.org/WebApplication">
        {children}
      </main>
      <Footer /> */}
    </>
  );
};