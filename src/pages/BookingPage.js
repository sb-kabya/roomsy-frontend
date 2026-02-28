import React, { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiUser, FiPhone, FiMapPin, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function BookingPage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const room = state?.room;
  const hotelName = state?.hotelName;

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: user?.full_name || '',
    phone: user?.phone_number || '',
    address: '',
    special_requests: '',
  });
  const [loading, setLoading] = useState(false);

  const nights = checkIn && checkOut ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * parseFloat(room?.price_per_night || 0);
  const balance = parseFloat(user?.balance || 0);
  const hasEnoughBalance = balance >= totalPrice;

  const handleBook = async () => {
    if (!checkIn || !checkOut) { toast.error('Please select dates'); return; }
    if (nights < 1) { toast.error('Check-out must be after check-in'); return; }
    if (!guestInfo.name) { toast.error('Please enter your name'); return; }
    if (!guestInfo.phone) { toast.error('Please enter phone number'); return; }
    if (!guestInfo.address) { toast.error('Please enter your address'); return; }

    if (!hasEnoughBalance) {
      toast.error(`Insufficient balance. You need $${totalPrice.toFixed(2)} but have $${balance.toFixed(2)}`);
      navigate('/profile');
      return;
    }

    setLoading(true);
    try {
      const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const res = await bookingAPI.create({
        room: parseInt(roomId),
        check_in_date: formatDate(checkIn),
        check_out_date: formatDate(checkOut),
      });
      await refreshUser();
      toast.success('Booking confirmed! Check your email.');
      navigate('/booking-success', { state: { booking: res.data.booking, guestInfo } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally { setLoading(false); }
  };

  if (!room) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏨</div>
        <p className="text-gray-500 mb-4">Room info not found</p>
        <Link to="/hotels" className="btn-primary">Browse Hotels</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to={`/hotels`} className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm mb-8 transition-colors">
          <FiArrowLeft size={16} /> Back to Hotels
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Complete Your Booking
        </h1>

        {/* Steps */}
        <div className="flex items-center mb-10">
          {[{ n: 1, l: 'Select Dates' }, { n: 2, l: 'Guest Info' }, { n: 3, l: 'Confirm' }].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > s.n ? 'bg-green-500 text-white' : step === s.n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.n ? <FiCheck size={16} /> : s.n}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === s.n ? 'text-blue-600' : 'text-gray-400'}`}>{s.l}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${step > s.n ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            {/* Step 1: Dates */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCalendar className="text-blue-600" /> Select Your Dates
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <DatePicker
                      selected={checkIn}
                      onChange={d => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(null); }}
                      minDate={new Date()}
                      placeholderText="Select check-in..."
                      className="input-field"
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <DatePicker
                      selected={checkOut}
                      onChange={d => setCheckOut(d)}
                      minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
                      placeholderText="Select check-out..."
                      className="input-field"
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                </div>
                {nights > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-blue-700 font-semibold">{nights} night{nights > 1 ? 's' : ''} — Total: <span className="text-2xl">${totalPrice.toFixed(2)}</span></p>
                  </div>
                )}
                <button onClick={() => { if (!checkIn || !checkOut) { toast.error('Please select both dates'); return; } setStep(2); }}
                  className="btn-primary mt-6 w-full justify-center">
                  Continue <FiArrowRight />
                </button>
              </div>
            )}

            {/* Step 2: Guest info */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiUser className="text-blue-600" /> Guest Information
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={guestInfo.name} onChange={e => setGuestInfo(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name" className="input-field pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <FiPhone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={guestInfo.phone} onChange={e => setGuestInfo(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+880 1XXX-XXXXXX" className="input-field pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <div className="relative">
                      <FiMapPin size={16} className="absolute left-4 top-3 text-gray-400" />
                      <textarea value={guestInfo.address} onChange={e => setGuestInfo(f => ({ ...f, address: e.target.value }))}
                        placeholder="Your full address" rows={3} className="input-field pl-10 resize-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests <span className="text-gray-400">(optional)</span></label>
                    <textarea value={guestInfo.special_requests} onChange={e => setGuestInfo(f => ({ ...f, special_requests: e.target.value }))}
                      placeholder="Early check-in, extra pillows, etc." rows={3} className="input-field resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                    <FiArrowLeft size={16} /> Back
                  </button>
                  <button onClick={() => { if (!guestInfo.name || !guestInfo.phone || !guestInfo.address) { toast.error('Please fill all required fields'); return; } setStep(3); }}
                    className="flex-1 btn-primary justify-center">
                    Continue <FiArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCheck className="text-blue-600" /> Confirm Booking
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Hotel</span><span className="font-medium">{hotelName}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Room</span><span className="font-medium">Room {room.room_number} ({room.room_type_display || room.room_type})</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Check-in</span><span className="font-medium">{checkIn?.toDateString()}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Check-out</span><span className="font-medium">{checkOut?.toDateString()}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Duration</span><span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Guest Name</span><span className="font-medium">{guestInfo.name}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Phone</span><span className="font-medium">{guestInfo.phone}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="text-gray-500">Address</span><span className="font-medium text-right max-w-48">{guestInfo.address}</span></div>
                  <div className="flex justify-between py-3 text-lg font-bold"><span>Total Amount</span><span className="text-blue-600">${totalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Your Balance</span><span className={hasEnoughBalance ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>${balance.toFixed(2)}</span></div>
                </div>
                {!hasEnoughBalance && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
                    ⚠️ Insufficient balance. Please <Link to="/profile" className="underline font-semibold">deposit ${(totalPrice - balance).toFixed(2)} more</Link> to proceed.
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                    <FiArrowLeft size={16} /> Back
                  </button>
                  <button onClick={handleBook} disabled={loading || !hasEnoughBalance}
                    className="flex-1 btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Confirming...' : 'Confirm & Pay'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Booking Summary</h3>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="font-bold text-gray-900">{hotelName}</p>
                <p className="text-sm text-gray-600 mt-0.5">Room {room.room_number} • {room.room_type_display || room.room_type}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Rate per night</span><span>${room.price_per_night}</span></div>
                <div className="flex justify-between text-gray-600"><span>Nights</span><span>{nights || '—'}</span></div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span><span className="text-blue-600 text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">💳 Payment will be deducted from your Roomsy wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
