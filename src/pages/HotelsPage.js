import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import { FiSearch, FiMapPin, FiStar, FiFilter, FiArrowRight, FiX } from 'react-icons/fi';

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => <FiStar key={i} size={13} className={i <= rating ? 'star-filled fill-current' : 'star-empty'} />)}
  </div>
);

const HotelCard = ({ hotel }) => (
  <Link to={`/hotels/${hotel.id}`} className="block card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <div className="relative h-52 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
      {hotel.primary_photo ? (
        <img src={hotel.primary_photo} alt={hotel.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-6xl">🏨</div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-600 flex items-center gap-1">
        <FiStar size={11} className="fill-current" /> {hotel.star_rating}-Star
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>{hotel.name}</h3>
      <p className="text-gray-500 text-sm flex items-center gap-1 mb-3"><FiMapPin size={13} /> {hotel.city}, {hotel.country}</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Stars rating={Math.round(hotel.average_rating)} />
            <span className="text-sm text-gray-500">({hotel.total_reviews} reviews)</span>
          </div>
          {hotel.min_price && <p className="text-blue-600 font-bold mt-1">From ${hotel.min_price}<span className="text-gray-400 font-normal text-xs">/night</span></p>}
        </div>
        <span className="text-blue-600 text-sm font-medium flex items-center gap-1">View <FiArrowRight size={13} /></span>
      </div>
    </div>
  </Link>
);

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    star_rating: searchParams.get('star_rating') || '',
    ordering: '-star_rating',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchHotels = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.city) params.city = filters.city;
    if (filters.star_rating) params.star_rating = filters.star_rating;
    if (filters.ordering) params.ordering = filters.ordering;
    hotelAPI.list(params)
      .then(r => {
        const data = r.data.results || r.data;
        setHotels(Array.isArray(data) ? data : []);
        setTotal(r.data.count || (Array.isArray(data) ? data.length : 0));
      })
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const handleSubmit = e => { e.preventDefault(); fetchHotels(); };

  const clearFilters = () => setFilters({ search: '', city: '', star_rating: '', ordering: '-star_rating' });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f1320, #1a2d5a)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Browse Hotels</h1>
          <p className="text-white/60">Discover {total} amazing properties around the world</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter bar */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-48 relative">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Search hotels..." className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <div className="flex-1 min-w-40 relative">
            <FiMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
              placeholder="City..." className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <select value={filters.star_rating} onChange={e => setFilters(f => ({ ...f, star_rating: e.target.value }))}
            className="input-field py-2.5 text-sm w-auto min-w-32">
            <option value="">All Stars</option>
            {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star</option>)}
          </select>
          <select value={filters.ordering} onChange={e => setFilters(f => ({ ...f, ordering: e.target.value }))}
            className="input-field py-2.5 text-sm w-auto min-w-36">
            <option value="-star_rating">Top Rated</option>
            <option value="name">Name A-Z</option>
            <option value="-created_at">Newest</option>
          </select>
          <button type="submit" className="btn-primary py-2.5 px-6 text-sm">Search</button>
          {(filters.search || filters.city || filters.star_rating) && (
            <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <FiX size={16} /> Clear
            </button>
          )}
        </form>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-5 space-y-3"><div className="h-5 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
              </div>
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotels found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-5">{total} hotels found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
