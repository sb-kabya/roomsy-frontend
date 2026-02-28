import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiDollarSign, FiEdit2, FiCheck, FiCreditCard } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone_number: user?.phone_number || '' });
  const [saving, setSaving] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt < 1) { toast.error('Minimum deposit is $1'); return; }
    setDepositing(true);
    try {
      await authAPI.deposit(amt);
      await refreshUser();
      toast.success(`$${amt} added to your wallet!`);
      setDepositAmount('');
    } catch (err) { toast.error(err.response?.data?.error || 'Deposit failed'); }
    finally { setDepositing(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Avatar + balance */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <h2 className="font-bold text-gray-900 text-xl">{user?.full_name || user?.username}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
              {user?.is_email_verified && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full mt-2">
                  <FiCheck size={11} /> Verified
                </span>
              )}
            </div>

            {/* Balance card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
              <p className="text-white/70 text-xs mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold">${parseFloat(user?.balance || 0).toFixed(2)}</p>
              <Link to="/payment" className="mt-3 w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-semibold text-center block">
                Add Funds
              </Link>
            </div>

            {/* Quick deposit */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FiDollarSign className="text-blue-600" /> Quick Deposit</h3>
              <form onSubmit={handleDeposit}>
                <input type="number" min="1" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                  placeholder="Amount ($)" className="input-field mb-3 text-sm py-2.5" />
                <div className="flex gap-2 mb-3">
                  {[10, 50, 100].map(a => (
                    <button key={a} type="button" onClick={() => setDepositAmount(String(a))}
                      className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                      ${a}
                    </button>
                  ))}
                </div>
                <button type="submit" disabled={depositing} className="btn-primary w-full justify-center text-sm disabled:opacity-50">
                  {depositing ? 'Processing...' : 'Deposit'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Profile form */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <FiEdit2 size={15} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-1.5 px-4 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    {editing ? (
                      <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="input-field" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiUser size={16} className="text-gray-400" />
                        <span className="text-gray-800">{user?.first_name || '—'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    {editing ? (
                      <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="input-field" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiUser size={16} className="text-gray-400" />
                        <span className="text-gray-800">{user?.last_name || '—'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiMail size={16} className="text-gray-400" />
                    <span className="text-gray-800">{user?.email}</span>
                    <span className="ml-auto text-xs text-gray-400">Cannot change</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {editing ? (
                    <div className="relative">
                      <FiPhone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.phone_number} onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))} placeholder="+880..." className="input-field pl-10" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiPhone size={16} className="text-gray-400" />
                      <span className="text-gray-800">{user?.phone_number || '—'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Account Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Username', value: user?.username, icon: FiUser },
                  { label: 'Member Since', value: user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—', icon: FiCheck },
                  { label: 'Email Verified', value: user?.is_email_verified ? 'Verified ✓' : 'Not Verified', icon: FiMail },
                  { label: 'Account Type', value: user?.is_staff ? 'Administrator' : 'Guest', icon: FiUser },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <item.icon size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/my-bookings" className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold text-center hover:bg-blue-100 transition-colors">
                My Bookings
              </Link>
              <Link to="/payment" className="flex-1 py-3 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold text-center hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1">
                <FiCreditCard size={15} /> Payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
