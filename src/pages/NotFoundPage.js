import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-blue-100 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <FiArrowLeft size={16} /> Go Home
          </Link>
          <Link to="/hotels" className="py-3 px-6 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Browse Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
