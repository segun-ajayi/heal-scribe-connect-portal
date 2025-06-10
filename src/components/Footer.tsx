
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Practice Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DA</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Dr. Funmilola Wuraola Ajayi</h2>
                <p className="text-gray-300">Medical Practice</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Providing comprehensive healthcare services with dedication to patient care and medical excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Dr. Ajayi
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-400 hover:text-white">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-gray-400 hover:text-white">
                  Publications
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <p>OAUTHC, Ile-Ife</p>
              <p>Osun State, Nigeria</p>
              <p>+234 (036) 230-0000</p>
              <p>info@oauthc.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Dr. Funmilola Wuraola Ajayi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
