import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMenu, FiX, FiLogOut, FiBookOpen, FiSettings, FiGrid } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/hotels', label: 'Hotels' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>R</span>
            </div>
            <span className={`text-2xl font-bold transition-colors ${isTransparent ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Roomsy
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`font-medium transition-colors hover:text-blue-500 ${
                  location.pathname === l.to
                    ? 'text-blue-500'
                    : isTransparent ? 'text-white/90' : 'text-gray-700'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isTransparent
                      ? 'text-white border border-white/30 hover:bg-white/10'
                      : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                    {user.first_name?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <span className="max-w-24 truncate">{user.first_name || user.email}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.full_name || user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">Balance: ${parseFloat(user.balance || 0).toFixed(2)}</p>
                    </div>
                    {user.is_staff && (
                      <Link to="/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <FiGrid size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/my-bookings" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <FiBookOpen size={16} /> My Bookings
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <FiSettings size={16} /> Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`font-medium transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 rounded-lg ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fadeInUp">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3">
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-semibold text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-blue-600 font-semibold">Balance: ${parseFloat(user.balance || 0).toFixed(2)}</p>
                  </div>
                  {user.is_staff && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors">Admin Dashboard</Link>}
                  <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors">My Bookings</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">Logout</button>
                </>
              ) : (
                <div className="flex gap-3 px-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-gray-700 font-medium">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-3 bg-blue-600 rounded-xl text-white font-medium">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
