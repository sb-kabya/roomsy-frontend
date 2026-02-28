import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import { FiSearch, FiStar, FiMapPin, FiArrowRight, FiShield, FiClock, FiAward, FiUsers, FiCheck, FiChevronDown } from 'react-icons/fi';

// ─── Star Rating 
const Stars = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <FiStar key={i} size={size} className={i <= rating ? 'star-filled fill-current' : 'star-empty'} />
    ))}
  </div>
);

// ─── Hotel Card 
const HotelCard = ({ hotel }) => (
  <Link to={`/hotels/${hotel.id}`} className="block card-hover bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
    <div className="relative h-52 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
      {hotel.primary_photo ? (
        <img src={hotel.primary_photo} alt={hotel.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-6xl">🏨</span>
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-600 flex items-center gap-1">
        <FiStar size={11} className="fill-current" /> {hotel.star_rating}-Star
      </div>
      {hotel.min_price && (
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          From ${hotel.min_price}/night
        </div>
      )}
    </div>
    <div className="p-5">
      <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>{hotel.name}</h3>
      <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
        <FiMapPin size={13} /> {hotel.city}, {hotel.country}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stars rating={Math.round(hotel.average_rating)} size={13} />
          <span className="text-sm text-gray-500">({hotel.total_reviews})</span>
        </div>
        <span className="text-blue-600 font-medium text-sm flex items-center gap-1">
          View Rooms <FiArrowRight size={13} />
        </span>
      </div>
    </div>
  </Link>
);

// ─── Hero Section ───
const HeroSection = () => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <section  className="min-h-screen flex items-center pt-20 pb-10 relative"  style={{ background: '#364575' }}
>


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white/80 text-sm font-medium mb-6 animate-fadeInUp">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            Trusted by 50,000+ travelers worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fadeInUp delay-100"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Find Your
            <span className="block gradient-text">Perfect Stay</span>
          </h1>
          <p className="text-xl text-white/70 mb-10 leading-relaxed animate-fadeInUp delay-200">
            Discover handpicked luxury hotels at unbeatable prices. From cozy retreats to grand palaces — your dream stay is just one click away.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row gap-3 animate-fadeInUp delay-300">
            <div className="flex-1 relative">
              <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Hotel name or keyword..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/50 outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="flex-1 relative">
              <FiMapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City or destination..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/50 outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <button type="submit" className="btn-gold px-8 py-3.5 text-sm font-bold whitespace-nowrap rounded-xl">
              Search Hotels
            </button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10 animate-fadeInUp delay-400">
            {[{ n: '500+', l: 'Hotels' }, { n: '50K+', l: 'Happy Guests' }, { n: '120+', l: 'Cities' }, { n: '4.9★', l: 'Rating' }].map(s => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-white">{s.n}</div>
                <div className="text-white/60 text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

// ─── Featured Hotels 
const FeaturedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelAPI.list({ ordering: '-star_rating' })
      .then(r => setHotels(r.data.results?.slice(0, 6) || r.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-pad bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Featured</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Top Rated Hotels
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Handpicked properties with exceptional service and unforgettable experiences</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/hotels" className="btn-primary">
            Explore All Hotels <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Why Choose Us 
const WhyChooseUs = () => {
  const features = [
    { icon: FiShield, title: 'Secure Booking', desc: 'Bank-grade encryption on all transactions. Your payment and data are always protected.', color: '#4f6ef7' },
    { icon: FiAward, title: 'Best Price Guarantee', desc: 'We match or beat any price. Find a better deal and we\'ll refund the difference.', color: '#e8b820' },
    { icon: FiUsers, title: '24/7 Support', desc: 'Our dedicated team is always available to help you with any questions or issues.', color: '#f59e0b' },
  ];
  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Why Roomsy</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Everything You Need for a Perfect Stay
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">We've reimagined hotel booking from the ground up — making it faster, safer, and more rewarding than ever before.</p>
            <div className="space-y-4">
              {['No hidden fees', 'Free cancellation on most bookings', 'Loyalty rewards on every stay', 'Real photos, honest reviews'].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FiCheck size={13} className="text-blue-600" />
                  </div>
                  <span className="text-gray-700">{t}</span>
                </div>
              ))}
            </div>
            <Link to="/hotels" className="btn-primary mt-8 inline-flex">Browse Hotels <FiArrowRight /></Link>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── How It Works ──
const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'Search Hotels', desc: 'Browse our curated collection of hotels. Filter by city, price, or star rating.' },
    { num: '02', title: 'Pick Your Room', desc: 'Choose from single, double, or suite options. See real photos and full details.' },
    { num: '03', title: 'Book & Pay', desc: 'Confirm your dates, provide your details, and pay securely via SSLCommerz.' },
  ];
  return (
    <section className="section-pad" style={{ background: '#385185' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Book in 4 Easy Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative p-7 rounded-2xl border border-white/10 hover:border-blue-200/40 transition-all group" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-5xl font-bold mb-4 opacity-20 group-hover:opacity-40 transition-opacity" style={{ fontFamily: 'Playfair Display, serif', color: '#4f6ef7' }}>{s.num}</div>
              <h3 className="text-white font-semibold text-lg mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-500/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ──
const Testimonials = () => {
  const reviews = [
    { name: 'Oggy', role: 'Business Traveler', rating: 5, text: 'Roomsy made my business trip so much easier.', avatar: 'SJ' },
    { name: 'Ahmed', role: 'Family Vacation', rating: 5, text: 'Found an amazing family resort at a great price.', avatar: 'AR' },
    { name: 'Miqi', role: 'Frequent Traveler', rating: 5, text: 'The best hotel booking platform I\'ve used.', avatar: 'LC' },
    { name: 'Jack', role: 'Trip', rating: 5, text: 'Everything was perfect — Highly recommended!', avatar: 'MP' },
  ];
  return (
    <section className="section-pad bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Reviews</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            What Our Guests Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover">
              <Stars rating={r.rating} />
              <p className="text-gray-600 text-sm mt-4 mb-5 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Destinations ──
const PopularDestinations = () => {
  const destinations = [
    { city: 'Cox-Bazar', country: 'Bangladesh', hotels: 48, bg: 'from-blue-600 to-blue-900' },
    { city: 'Bandarban', country: 'Bangladesh', hotels: 13,  bg: 'from-pink-600 to-purple-900' },
    { city: 'Rangamati', country: 'Bangladesh', hotels: 15, bg: 'from-red-600 to-orange-900' },
    { city: 'Sylhet', country: 'Bangladesh', hotels: 15, bg: 'from-green-600 to-cyan-900' },
    { city: 'Patenga', country: 'Bangladesh', hotels: 5, bg: 'from-blue-600 to-blue-900' },
    { city: 'Saint Martin', country: 'Bangladesh', hotels: 20, bg: 'from-red-600 to-orange-900' },
  ];
  const navigate = useNavigate();
  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Explore</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Popular Destinations
          </h2>
          <p className="text-gray-500 mt-3">Discover the world's most sought-after travel destinations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((d, i) => (
            <button key={i} onClick={() => navigate(`/hotels?city=${d.city}`)}
              className={`bg-gradient-to-br ${d.bg} p-5 rounded-2xl text-center card-hover group cursor-pointer`}>
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">{d.emoji}</div>
              <h3 className="font-bold text-white text-sm mb-0.5">{d.city}</h3>
              <p className="text-white/60 text-xs">{d.hotels} hotels</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA Banner 
const CTABanner = () => (
  <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d4bd4 0%, #4f6ef7 50%, #1a2d5a 100%)' }}>
    <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #e8b820, transparent)' }}></div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Ready for Your Next Adventure?
      </h2>
      <p className="text-white/75 text-lg mb-8">Join thousands of happy travelers. Create your account and get exclusive member rates.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/register" className="btn-gold text-sm py-4 px-10 rounded-xl font-bold">
          Create Free Account
        </Link>
        <Link to="/hotels" className="bg-white/15 border border-white/30 text-white py-4 px-10 rounded-xl font-semibold text-sm hover:bg-white/25 transition-all">
          Browse Hotels
        </Link>
      </div>
    </div>
  </section>
);

// ─── Page 
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedHotels />
      <WhyChooseUs />
      <HowItWorks />
      <PopularDestinations />
      <Testimonials />
      <CTABanner />
    </>
  );
}
