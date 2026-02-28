import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar, FiX, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: FiCheck },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: FiX },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700', icon: FiCheck },
};

export default function MyBookingsPage() {
  const { } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchBookings = () => {
    setLoading(true);
    bookingAPI.myBookings()
      .then(r => setBookings(r.data.results || r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking? Your payment will be refunded.')) return;
    setCancelling(bookingId);
    try {
      const res = await bookingAPI.cancel(bookingId);
      toast.success(res.data.message || 'Booking cancelled and refunded');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancellation failed');
    } finally { setCancelling(null); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>My Bookings</h1>
            <p className="text-gray-500 mt-1">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/hotels" className="btn-primary text-sm">Book New Hotel</Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}>
              {f} {f === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings.`}
            </p>
            <Link to="/hotels" className="btn-primary">Browse Hotels</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => {
              const StatusIcon = statusConfig[b.status]?.icon || FiClock;
              const isUpcoming = new Date(b.check_in_date) > new Date() && b.status === 'confirmed';
              return (
                <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                              #{String(b.booking_id).substring(0, 8).toUpperCase()}
                            </p>
                            <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                              {b.hotel_name}
                            </h3>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig[b.status]?.color}`}>
                            <StatusIcon size={11} /> {statusConfig[b.status]?.label}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiCalendar size={14} className="text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-400">Check-in</p>
                              <p className="font-medium text-gray-800">{new Date(b.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiCalendar size={14} className="text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-400">Check-out</p>
                              <p className="font-medium text-gray-800">{new Date(b.check_out_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiClock size={14} className="text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-400">Duration</p>
                              <p className="font-medium text-gray-800">{b.total_nights} night{b.total_nights > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-400">Room {b.room_info?.room_number} • {b.room_info?.room_type_display}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">${b.total_price}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isUpcoming && (
                      <div className="mt-4 flex gap-3">
                        <div className="flex-1 flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-sm text-green-700">
                          <FiAlertCircle size={14} /> Upcoming stay in {Math.ceil((new Date(b.check_in_date) - new Date()) / (1000 * 60 * 60 * 24))} day{Math.ceil((new Date(b.check_in_date) - new Date()) / (1000 * 60 * 60 * 24)) !== 1 ? 's' : ''}
                        </div>
                        <button
                          onClick={() => handleCancel(b.booking_id)}
                          disabled={cancelling === b.booking_id}
                          className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {cancelling === b.booking_id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
