import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.first_name || 'there'}!`);
      navigate(user.is_staff ? '/dashboard' : '/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Roomsy</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field pl-11" autoComplete="email" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="/#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <div className="relative">
                <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Your password" className="input-field pl-11 pr-11" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 text-base py-3.5">
              {loading ? 'Signing in...' : (<>Sign In <FiArrowRight /></>)}
            </button>
          </form>


          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>

      {/* Right: image */}
      <div className="hidden lg:flex flex-1 bg-blue-200 items-center justify-center p-12 relative">
        <div className="text-center text-blue relative z-10">
          <div className="text-8xl mb-6 animate-float">🏨</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Your Next Stay Awaits</h2>
          <p className="text-blue/70 text-lg max-w-xs mx-auto">Discover amazing hotels at reasonable prices, all in one place.</p>
          <div className="flex justify-center gap-8 mt-10">
            {[{ n: '500+', l: 'Hotels' }, { n: '50K+', l: 'Guests' }, { n: '4.9★', l: 'Rating' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-bold text-white">{s.n}</div>
                <div className="text-blue/50 text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
