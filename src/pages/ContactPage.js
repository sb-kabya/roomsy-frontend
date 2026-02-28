import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const contacts = [
    { icon: FiMail, title: 'Email Us', value: 'support@roomsy.com', sub: 'We reply within 24 hours', color: '#4f6ef7' },
    { icon: FiPhone, title: 'Call Us', value: '+880 1800 000000', sub: 'Mon–Fri, 9am–6pm BST', color: '#10b981' },
    { icon: FiMapPin, title: 'Visit Us', value: 'Dhaka, Bangladesh', sub: 'Banani, Dhaka-1213', color: '#e8b820' },
    { icon: FiClock, title: 'Support Hours', value: '24/7 Online', sub: 'Always here to help', color: '#f59e0b' },
  ];

  const faqs = [
    { q: 'How do I cancel a booking?', a: 'Go to My Bookings and click Cancel on any upcoming reservation. Refund is instant.' },
    { q: 'Is my payment secure?', a: 'Yes. We use SSLCommerz and 256-bit SSL encryption for all transactions.' },
    { q: 'Can I modify my booking dates?', a: 'Currently, modifications require cancelling and re-booking. Free cancellation is available on most rooms.' },
    { q: 'How do I get a refund?', a: 'Refunds are automatically credited to your Roomsy wallet within minutes of cancellation.' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="hero-bg py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Get In Touch</h1>
          <p className="text-white/70 text-lg">Have a question or need help? Our team is here for you.</p>
        </div>
      </div>

      {/* Contact cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
            {contacts.map((c, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${c.color}15` }}>
                  <c.icon size={22} style={{ color: c.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{c.title}</h3>
                <p className="font-medium text-gray-800 text-sm">{c.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact form */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" className="input-field text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" className="input-field text-sm py-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" className="input-field text-sm py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your question or issue..." rows={5} className="input-field text-sm resize-none" />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-50">
                  <FiSend size={16} /> {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Frequently Asked</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
