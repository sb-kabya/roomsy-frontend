import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { FiUsers, FiHome, FiCalendar, FiDollarSign, FiTrendingUp, FiStar } from 'react-icons/fi';

const StatCard = ({ title, value, sub, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</p>
    {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.stats()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <p className="text-gray-500">Failed to load dashboard</p>
    </div>
  );

  const stats = [
    { title: 'Total Users', value: data.user_statistics?.total_users || 0, sub: `${data.user_statistics?.new_this_month || 0} new this month`, icon: FiUsers, color: '#4f6ef7' },
    { title: 'Total Hotels', value: data.room_statistics ? Math.floor(data.room_statistics.total_rooms / 3) : 0, sub: `${data.room_statistics?.total_rooms || 0} total rooms`, icon: FiHome, color: '#10b981' },
    { title: 'Total Bookings', value: data.booking_statistics?.total_bookings || 0, sub: `${data.booking_statistics?.bookings_this_month || 0} this month`, icon: FiCalendar, color: '#f59e0b' },
    { title: 'Total Revenue', value: `$${parseFloat(data.revenue_statistics?.total_revenue || 0).toFixed(0)}`, sub: `${data.revenue_statistics?.growth_percent >= 0 ? '+' : ''}${data.revenue_statistics?.growth_percent || 0}% this month`, icon: FiDollarSign, color: '#e8b820' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and analytics</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Top rooms */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" /> Most Booked Rooms
            </h2>
            {data.most_booked_rooms?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {data.most_booked_rooms?.slice(0, 8).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">#{i + 1}</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{r.room__hotel__name}</p>
                        <p className="text-gray-400 text-xs">Room {r.room__room_number} • {r.room__room_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-sm">{r.booking_count} bookings</p>
                      <p className="text-gray-400 text-xs">${parseFloat(r.revenue || 0).toFixed(0)} revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
              <FiStar className="text-yellow-500" /> Top Spenders
            </h2>
            {data.top_5_users?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.top_5_users?.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                        {u.user__first_name?.[0] || u.user__email?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{u.user__first_name} {u.user__last_name}</p>
                        <p className="text-gray-400 text-xs">{u.user__email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm">${parseFloat(u.total_spent || 0).toFixed(0)}</p>
                      <p className="text-gray-400 text-xs">{u.booking_count} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hotel stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Hotel Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Hotel</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">City</th>
                  <th className="text-center py-3 px-3 text-gray-500 font-medium">Stars</th>
                  <th className="text-center py-3 px-3 text-gray-500 font-medium">Bookings</th>
                  <th className="text-right py-3 px-3 text-gray-500 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.hotel_statistics?.map((h, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900">{h.name}</td>
                    <td className="py-3 px-3 text-gray-500">{h.city}</td>
                    <td className="py-3 px-3 text-center text-yellow-500">{'★'.repeat(h.star_rating)}</td>
                    <td className="py-3 px-3 text-center font-semibold text-blue-600">{h.booking_count || 0}</td>
                    <td className="py-3 px-3 text-right font-semibold text-green-600">${parseFloat(h.total_revenue || 0).toFixed(0)}</td>
                  </tr>
                ))}
                {(!data.hotel_statistics || data.hotel_statistics.length === 0) && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">No hotel data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
