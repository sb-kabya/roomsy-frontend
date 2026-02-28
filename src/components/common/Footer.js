import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: '#0f1320' }} className="text-gray-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>R</span>
              </div>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Roomsy</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your gateway to extraordinary stays. Discover and book handpicked luxury hotels around the world with ease.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a key={i} href="/#" className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center hover:bg-blue-600 transition-colors text-gray-400 hover:text-white" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          
          <div>
            <h4 className="text-white font-semibold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/hotels', label: 'Browse Hotels' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/register', label: 'Create Account' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-500 inline-block"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our Services</h4>
            <ul className="space-y-3">
              {['Hotel Booking', 'Room Selection', 'Secure Payments', 'Cancellation Policy', '24/7 Support', 'Member Rewards'].map(s => (
                <li key={s} className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-yellow-400 inline-block"></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={16} className="text-blue-400 flex-shrink-0" />
                +880 1811111111
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={16} className="text-blue-400 flex-shrink-0" />
                support@roomsy.com
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)' }}>
              <p className="text-sm text-gray-300 font-medium mb-2">Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">Go</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© 2026 Roomsy. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="/#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
