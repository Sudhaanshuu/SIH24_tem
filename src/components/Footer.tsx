import React from 'react';
import { Shield, Github, Mail, Linkedin } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const Footer: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} mt-12`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-8 w-8 text-emerald-500 mr-2" />
            <div>
              <h2 className="text-xl font-bold">Raksha Netra</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                By Sudhanshu
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/sudhanshu"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-emerald-500 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@example.com"
              className={`hover:text-emerald-500 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/sudhanshu"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-emerald-500 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 md:mb-0`}>
              © {new Date().getFullYear()} Raksha Netra. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className={`text-sm hover:text-emerald-500 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`text-sm hover:text-emerald-500 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className={`text-sm hover:text-emerald-500 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};