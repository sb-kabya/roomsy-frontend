import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiStar, FiUsers, FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  const team = [
    { name: 'Kabya', role: 'CEO & Founder', emoji: '👨‍💼' },
    { name: 'Orry', role: 'Head of Design', emoji: '👩‍🎨' },
    { name: 'Tujo', role: 'CTO', emoji: '👨‍💻' },
    { name: 'Samsul', role: 'Head of Customer Success', emoji: '👩‍💼' },
  ];

  const milestones = [
    { year: '2020', event: 'Roomsy founded with a mission to simplify hotel booking' },
    { year: '2021', event: 'Reached 10,000 users and 100 hotel partnerships' },
    { year: '2022', event: 'Expanded to 50+ cities across South & Southeast Asia' },
    { year: '2024', event: '50,000+ happy guests and counting' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="hero-bg py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-widest">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-3 mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Redefining Hotel Booking
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">We believe that finding and booking the perfect hotel should be effortless and enjoyable for everyone.</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiTarget, title: 'Our Mission', text: 'To make world-class accommodations accessible to every traveler by providing a seamless, trustworthy booking experience.', color: '#4f6ef7' },
              { icon: FiStar, title: 'Our Vision', text: 'To become South Asia\'s most trusted travel platform, with exceptional hotel experiences.', color: '#10b981' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${item.color}15` }}>
                  <item.icon size={26} style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: '#0f1320' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ n: '500+', l: 'Hotels' }, { n: '50K+', l: 'Happy Guests' }, { n: '120+', l: 'Cities' }, { n: '4.9/5', l: 'Avg Rating' }].map(s => (
            <div key={s.l}>
              <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{s.n}</p>
              <p className="text-white/50">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-14" style={{ fontFamily: 'Playfair Display, serif' }}>Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{m.year}</div>
                <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-gray-700">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{t.emoji}</div>
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ready to Start Exploring?</h2>
          <p className="text-white/75 mb-8">Join thousands of travelers who trust Roomsy for every trip.</p>
          <Link to="/hotels" className="btn-gold inline-flex items-center gap-2">Browse Hotels <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}
