import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheck, FiCalendar, FiHome, FiBookOpen } from 'react-icons/fi';

export default function BookingSuccessPage() {
  const { state } = useLocation();
  const booking = state?.booking;
  const guestInfo = state?.guestInfo;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center">
      <div className="max-w-2xl mx-auto px-4 py-10 w-full">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center animate-fadeIn">
              <FiCheck size={40} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-lg">Your room has been successfully reserved. Check your email for confirmation.</p>
        </div>

        {/* Booking card */}
        {booking && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Booking Reference</p>
              <p className="text-white text-xl font-bold mt-0.5">#{String(booking.booking_id).substring(0, 8).toUpperCase()}</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Hotel</span>
                <span className="font-medium text-gray-900">{booking.hotel_name}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Room</span>
                <span className="font-medium text-gray-900">{booking.room_info?.room_number} ({booking.room_info?.room_type_display})</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium text-gray-900 flex items-center gap-1"><FiCalendar size={13} /> {booking.check_in_date}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium text-gray-900 flex items-center gap-1"><FiCalendar size={13} /> {booking.check_out_date}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-gray-900">{booking.total_nights} night{booking.total_nights > 1 ? 's' : ''}</span>
              </div>
              {guestInfo && (
                <>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Guest Name</span>
                    <span className="font-medium text-gray-900">{guestInfo.name}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{guestInfo.phone}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-3">
                <span className="font-bold text-gray-900 text-lg">Amount Paid</span>
                <span className="font-bold text-blue-600 text-2xl">${booking.total_price}</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                <FiCheck size={16} /> Payment deducted from your Roomsy wallet
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/my-bookings" className="flex-1 btn-primary justify-center text-sm">
            <FiBookOpen size={16} /> My Bookings
          </Link>
          <Link to="/hotels" className="flex-1 py-3 px-6 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <FiHome size={16} /> Browse More Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
