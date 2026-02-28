import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FiCheck, FiX } from 'react-icons/fi';

export default function ActivationPage() {
  const { uid, token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    authAPI.activate(uid, token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg border border-gray-100">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900">Activating Account...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
              <FiCheck size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Account Activated!</h2>
            <p className="text-gray-500 mb-6">Your account has been successfully activated. You can now sign in.</p>
            <Link to="/login" className="btn-primary w-full justify-center">Sign In Now</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6">
              <FiX size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Activation Failed</h2>
            <p className="text-gray-500 mb-6">The activation link is invalid or has expired. Please register again.</p>
            <Link to="/register" className="btn-primary w-full justify-center">Register Again</Link>
          </>
        )}
      </div>
    </div>
  );
}
