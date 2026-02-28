import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiDollarSign, FiShield } from 'react-icons/fi';

export default function PaymentPage() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 1) { toast.error('Minimum deposit is $1'); return; }
    setLoading(true);
    try {
      await authAPI.deposit(amt);
      await refreshUser();
      toast.success(`$${amt} added to your wallet!`);
      setAmount('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Deposit failed');
    } finally { setLoading(false); }
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-md mx-auto px-4 py-12">

        <Link to="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm mb-8 transition-colors">
          <FiArrowLeft size={16} /> Back to Profile
        </Link>
        {/* Balance card */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 text-white text-center">
          <p className="text-white/70 text-sm mb-1">Current Wallet Balance</p>
          <p className="text-5xl font-bold my-2">
            ${parseFloat(user?.balance || 0).toFixed(2)}
          </p>
          <p className="text-white/60 text-sm">{user?.email}</p>
        </div>

        {/* Deposit form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-xl mb-5 flex items-center gap-2">
            <FiDollarSign className="text-blue-600" /> Add Funds
          </h2>
          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {quickAmounts.map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                  amount === String(a)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}>
                ${a}
              </button>
            ))}
          </div>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Amount ($)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount..."
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? 'Processing...' : `Add $${amount || '0'} to Wallet`}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiShield size={15} className="text-green-500" />
              Secured by SSLCommerz — supports bKash, Nagad, Rocket, VISA & more
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Funds are added instantly to your Roomsy wallet
        </p>

      </div>
    </div>
  );
}