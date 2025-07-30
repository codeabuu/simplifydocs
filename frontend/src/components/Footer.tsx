import React from "react";
import { FileSpreadsheet, Twitter, Linkedin, Github, Mail, MessageSquare, Zap, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FileSpreadsheet className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                AskAnalytIQ
              </span>
            </div>
            <p className="text-gray-400 text-base mb-4">
              AI-powered data analysis that transforms complex information into actionable insights.
            </p>
            <div className="flex space-x-3">
              <a href="/" className="text-gray-400 hover:text-white transition-colors transform hover:scale-105" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="/" className="text-gray-400 hover:text-white transition-colors transform hover:scale-105" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="/" className="text-gray-400 hover:text-white transition-colors transform hover:scale-105" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="/" className="text-gray-400 hover:text-white transition-colors transform hover:scale-105" aria-label="Facebook">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 flex items-center">
              <Zap className="w-4 h-4 text-primary-400 mr-2" />
              Product
            </h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Features</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Pricing</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Live Demo</a></li>
              {/* <li><a href="#roadmap" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Roadmap</a></li> */}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 flex items-center">
              <FileText className="w-4 h-4 text-primary-400 mr-2" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Blog</a></li>
              <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Documentation</a></li>
              <li><a href="/tutorials" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Tutorials</a></li>
              <li><a href="/api" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">API</a></li>
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 className="text-base font-semibold mb-4 flex items-center">
              <Mail className="w-4 h-4 text-primary-400 mr-2" />
              Contact
            </h4>
            <ul className="space-y-3">
              <li><a href="mailto:support@askanaltiq.com" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">support@askanaltiq.com</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Contact Sales</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Careers</a></li>
              <li><a href="/press" className="text-gray-400 hover:text-white transition-colors hover:underline text-sm">Press</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs mb-3 md:mb-0">
              © {new Date().getFullYear()} AskAnalytIQ. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 w-full md:w-auto">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-xs">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-xs">Terms of Service</a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-xs">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;