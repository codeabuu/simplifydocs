import React from "react";
import { FileSpreadsheet, Twitter, Linkedin, Github, Mail, MessageSquare, Zap, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <FileSpreadsheet className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                AskAnalytIQ
              </span>
            </div>
            <p className="text-gray-400 text-lg mb-6">
              AI-powered data analysis that transforms complex information into actionable insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Facebook">
                <MessageSquare className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Zap className="w-5 h-5 text-primary-400 mr-2" />
              Product
            </h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors hover:underline">Features</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors hover:underline">Pricing</a></li>
              <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors hover:underline">Live Demo</a></li>
              <li><a href="#roadmap" className="text-gray-400 hover:text-white transition-colors hover:underline">Roadmap</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <FileText className="w-5 h-5 text-primary-400 mr-2" />
              Resources
            </h4>
            <ul className="space-y-4">
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors hover:underline">Blog</a></li>
              <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors hover:underline">Documentation</a></li>
              <li><a href="/tutorials" className="text-gray-400 hover:text-white transition-colors hover:underline">Tutorials</a></li>
              <li><a href="/api" className="text-gray-400 hover:text-white transition-colors hover:underline">API</a></li>
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Mail className="w-5 h-5 text-primary-400 mr-2" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li><a href="mailto:support@askanaltiq.com" className="text-gray-400 hover:text-white transition-colors hover:underline">support@askanaltiq.com</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors hover:underline">Contact Sales</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors hover:underline">Careers</a></li>
              <li><a href="/press" className="text-gray-400 hover:text-white transition-colors hover:underline">Press</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AskAnalytIQ. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;