import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', first_name: '', last_name: '', password: '', re_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.username || !form.password) {
      toast.error('Please fill all fields'); return;
    }
    if (form.password !== form.re_password) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      await authAPI.register(form);
      setDone(true);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const msg = Object.values(errors).flat()[0];
        toast.error(typeof msg === 'string' ? msg : 'Registration failed');
      } else { toast.error('Registration failed'); }
    } finally { setLoading(false); }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg border border-gray-100">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
          <FiCheck size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          Check Your Email!
        </h2>
        <p className="text-gray-500 mb-6">We sent an activation link to <strong>{form.email}</strong>. Click the link to activate your account.</p>
        <Link to="/login" className="btn-primary w-full justify-center">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left: image */}
      <div className="hidden lg:flex flex-1 hero-bg items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="text-8xl mb-6 animate-float">✨</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Join Roomsy Today</h2>
          <p className="text-white/70 text-lg max-w-xs mx-auto mb-10">Get exclusive member rates and instant booking confirmation.</p>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {['No booking fees', 'Free cancellation', 'Loyalty rewards', 'Instant confirmation'].map(t => (
              <div key={t} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={12} className="text-green-400" />
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Roomsy</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Create Account</h1>
          <p className="text-gray-500 mb-8">Start booking in minutes — it's completely free</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="John" className="input-field pl-10 text-sm py-3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Doe" className="input-field pl-10 text-sm py-3" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input-field pl-10 text-sm py-3" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="johndoe" className="input-field pl-10 text-sm py-3" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" className="input-field pl-10 pr-10 text-sm py-3" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.re_password} onChange={e => setForm(f => ({ ...f, re_password: e.target.value }))} placeholder="Repeat password" className="input-field pl-10 text-sm py-3" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 py-3.5 text-base">
              {loading ? 'Creating account...' : (<>Create Account <FiArrowRight /></>)}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
