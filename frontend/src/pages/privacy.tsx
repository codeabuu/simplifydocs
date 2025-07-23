// PrivacyPolicy.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shadow-sm">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/homelogo-preview.png"
              alt="AskAnalytIQ Logo"
              className="h-12 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p><strong>Effective Date:</strong> July 21, 2025</p>
        <p><strong>Last Updated:</strong> March 20th, 2025</p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            AskAnalytIQ we respects your privacy. This Privacy Policy describes how we collect, use, and protect your information when you use our AI-powered SaaS platform that allows users to upload and interact with PDF and Excel files ("Service").
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p><strong>a) Account Information:</strong> Name, email address, and password.</p>
          <p><strong>b) Uploaded Files:</strong> Documents like PDFs or Excel sheets you upload. These are processed temporarily.</p>
          <p><strong>c) Usage Data:</strong> IP address, browser details, usage logs, and interaction patterns.</p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To provide, operate, and maintain the AskAnalytIQ Service.</li>
            <li>To manage billing and subscriptions.</li>
            <li>To enhance platform security and reliability.</li>
            <li>To offer customer support and notify you about changes or updates.</li>
          </ul>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">4. AI and File Processing</h2>
          <p>
            Uploaded files are processed securely and temporarily to generate AI-based insights. Files are not used to train AI models or shared with third parties. You retain full ownership of your data.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">5. Data Retention</h2>
          <p>
            Uploaded files are stored temporarily and deleted after [e.g., 24 hours]. Logs related to activity and billing are retained for compliance purposes.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">6. Sharing and Disclosure</h2>
          <p>
            We do not sell your data. Information is only shared with:
          </p>
          <ul className="list-disc pl-6">
            <li>Trusted service providers (e.g., payment processors, hosting services).</li>
            <li>Authorities when legally required.</li>
            <li>To prevent fraud, abuse, or security threats.</li>
          </ul>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">7. Cookies and Tracking</h2>
          <p>
            We use cookies for session management and analytics. You may disable cookies in your browser, but some features may not function properly.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">8. Data Security</h2>
          <p>
            We implement encryption, access control, and other safeguards to protect your information. However, no system can guarantee absolute security.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">9. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6">
            <li>Access, correct, or delete your data.</li>
            <li>Request restriction or object to data processing.</li>
            <li>Request data portability.</li>
          </ul>
          <p>To exercise your rights, contact us at <a href="mailto:support@askanalytiq.com" className="text-blue-600 underline">support@askanalytiq.com</a>.</p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">10. Children's Privacy</h2>
          <p>
            AskAnalytIQ is not intended for children under 18. We do not knowingly collect data from minors.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notice.
          </p>
        </section>

        <section className="mt-4 mb-8">
          <h2 className="text-xl font-semibold">12. Contact Us</h2>
          <p>
            If you have any questions or concerns, contact us at:  
            <br />
            📧 <a href="mailto:support@askanalytiq.com" className="text-blue-600 underline">support@askanalytiq.com</a>
            <br />
            {/* 🏢 AskAnalytIQ, [Insert Company Address] */}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
