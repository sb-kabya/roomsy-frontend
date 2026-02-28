import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hotelAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiArrowLeft, FiUsers, FiCheck, FiSend } from 'react-icons/fi';

const Stars = ({ rating, interactive = false, onRate }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => (
      <FiStar key={i} size={interactive ? 24 : 14}
        className={`${i <= rating ? 'star-filled fill-current' : 'star-empty'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={() => interactive && onRate && onRate(i)} />
    ))}
  </div>
);

const RoomCard = ({ room, hotelName }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const typeColors = { single: 'bg-blue-100 text-blue-700', double: 'bg-purple-100 text-purple-700', suite: 'bg-yellow-100 text-yellow-700' };

  const handleBook = () => {
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    navigate(`/booking/${room.id}`, { state: { room, hotelName } });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm card-hover">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-gray-900 text-lg">Room {room.room_number}</h4>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[room.room_type] || 'bg-gray-100 text-gray-700'}`}>
            {room.room_type_display || room.room_type}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">${room.price_per_night}</p>
          <p className="text-xs text-gray-400">per night</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <FiUsers size={14} /> Up to {room.capacity} guests
      </div>
      {room.is_available ? (
        <button onClick={handleBook} className="btn-primary w-full text-sm justify-center">
          Book This Room
        </button>
      ) : (
        <div className="w-full py-3 bg-gray-100 text-gray-400 text-center rounded-xl text-sm font-medium">
          Not Available
        </div>
      )}
    </div>
  );
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchHotel = () => {
    hotelAPI.detail(id)
      .then(r => setHotel(r.data))
      .catch(() => toast.error('Hotel not found'))
      .finally(() => setLoading(false));
  };

 useEffect(() => { fetchHotel(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to write a review'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      await reviewAPI.create({ hotel: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchHotel();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h2 className="text-xl font-semibold text-gray-700">Hotel not found</h2>
        <Link to="/hotels" className="btn-primary mt-4 inline-flex">Back to Hotels</Link>
      </div>
    </div>
  );

  const avgRating = hotel.average_rating || 0;
  const amenities = hotel.amenities ? hotel.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden">
        {hotel.photos?.[0]?.image && (
          <img src={hotel.photos[0].image} alt={hotel.name} className="w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link to="/hotels" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <FiArrowLeft size={16} /> Back to Hotels
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{hotel.name}</h1>
              <p className="text-white/75 flex items-center gap-2 mt-2"><FiMapPin size={16} /> {hotel.address}, {hotel.city}, {hotel.country}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <Stars rating={Math.round(avgRating)} />
                  <span className="text-white font-bold text-lg">{avgRating.toFixed(1)}</span>
                </div>
                <span className="text-white/60 text-sm">{hotel.total_reviews} reviews</span>
              </div>
              <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-xl font-bold text-lg">
                {hotel.star_rating}★
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>About This Hotel</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map(a => (
                    <span key={a} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-medium">
                      <FiCheck size={13} /> {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['rooms', 'reviews'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`flex-1 py-4 font-semibold text-sm capitalize transition-colors ${
                      activeTab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {t} {t === 'rooms' ? `(${hotel.rooms?.length || 0})` : `(${hotel.reviews?.length || 0})`}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'rooms' && (
                  <div className="space-y-4">
                    {hotel.rooms?.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No rooms available</p>
                    ) : (
                      hotel.rooms?.map(r => <RoomCard key={r.id} room={r} hotelName={hotel.name} />)
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {user && (
                      <form onSubmit={submitReview} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Your Rating</p>
                          <Stars rating={reviewForm.rating} interactive onRate={r => setReviewForm(f => ({ ...f, rating: r }))} />
                        </div>
                        <textarea
                          value={reviewForm.comment}
                          onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          placeholder="Share your experience..."
                          rows={4}
                          className="input-field resize-none mb-3"
                        />
                        <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
                          <FiSend size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}
                    {hotel.reviews?.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
                    ) : (
                      hotel.reviews?.map(r => (
                        <div key={r.id} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                                {r.user_name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{r.user_name}</p>
                                <Stars rating={r.rating} />
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 text-sm ml-12 leading-relaxed">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-900 font-medium">{hotel.city}, {hotel.country}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Star Rating</span><span className="text-yellow-600 font-bold">{'⭐'.repeat(hotel.star_rating)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Rooms</span><span className="text-gray-900 font-medium">{hotel.rooms?.length || 0}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Available</span><span className="text-green-600 font-medium">{hotel.rooms?.filter(r => r.is_available).length || 0} rooms</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Reviews</span><span className="text-gray-900 font-medium">{hotel.total_reviews}</span></div>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100">
                {hotel.rooms?.find(r => r.is_available) ? (
                  <button onClick={() => setActiveTab('rooms')} className="btn-primary w-full justify-center text-sm">
                    View Available Rooms
                  </button>
                ) : (
                  <div className="bg-red-50 text-red-600 text-center py-3 rounded-xl text-sm font-medium">
                    No Rooms Available
                  </div>
                )}
              </div>
            </div>

            {/* Photos */}
            {hotel.photos?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hotel.photos.map(p => (
                    <img key={p.id} src={p.image} alt={p.caption || hotel.name} className="w-full h-24 object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
