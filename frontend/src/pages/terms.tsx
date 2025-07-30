// TermsAndConditions.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // assuming you're using React Router

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shadow-sm">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/homelogo-preview.png"
              alt="AskAnalytIQ Logo"
              className="h-12 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
        {/* Login Button */}
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p><strong>Effective Date:</strong> July 21, 2025</p>
        <p><strong>Last Updated:</strong> March 20th, 2025</p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">1. Eligibility</h2>
          <p>You must be at least 18 years old and capable of forming a binding contract to use the Service.</p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">2. User Accounts</h2>
          <p>You must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your login credentials and for any activity under your account.</p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">3. Subscription and Billing</h2>
          <p>
            Access to the Service is provided on a paid subscription basis. Prices and payment terms are listed on our website and may change with notice. By subscribing, you authorize us to charge your payment method on a recurring basis until you cancel. All fees are non-refundable unless stated otherwise.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">4. Use of the Service</h2>
          <p>
            You agree to use the Service only for lawful purposes. You may not:
          </p>
          <ul className="list-disc pl-6">
            <li>Upload content that infringes on intellectual property rights or privacy.</li>
            <li>Use the Service to store or distribute malicious, illegal, or offensive content.</li>
            <li>Attempt to reverse-engineer, tamper with, or disrupt the Service.</li>
          </ul>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">5. User Data and Content</h2>
          <p>
            You retain full ownership of the files (PDFs, Excel) and data you upload. We do not claim ownership of your content. You grant us a limited license to process and interact with your content solely for the purpose of providing the Service.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">6. AI Usage Disclaimer</h2>
          <p>
            Our AI features provide insights and responses based on your uploaded documents. These outputs are automatically generated and may contain errors. We do not guarantee the accuracy, completeness, or reliability of AI-generated content. Use at your own discretion.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">7. Data Security</h2>
          <p>
            We use commercially reasonable measures to protect your data. However, no method of transmission or storage is completely secure. By using the Service, you acknowledge and accept this risk.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account without notice if you violate these Terms or misuse the Service.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">9. Modifications to the Service</h2>
          <p>
            We may update or discontinue parts of the Service at any time. Significant changes will be communicated through email or the platform.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages including but not limited to data loss or profit loss resulting from your use of the Service.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold us harmless from any claims, damages, or losses arising out of your use of the Service or violation of these Terms.
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-semibold">12. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of [Your Country/State], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mt-4 mb-8">
          <h2 className="text-xl font-semibold">13. Contact Us</h2>
          <p>
            If you have any questions, please contact us at <a href="mailto:support@askanalytiq.com" className="text-blue-600 underline">support@askanalytiq.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;