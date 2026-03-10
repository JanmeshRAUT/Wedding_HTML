import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, User, LogIn, LayoutDashboard, Calendar, DollarSign, CheckCircle, LogOut, Menu, X, Search, Filter, Star, MapPin, ArrowLeft, Info, CreditCard, Shield, Clock, TrendingUp } from 'lucide-react';

// --- Types ---
interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Booking {
  booking_id: number;
  vendor_name: string;
  booking_date: string;
  budget: number;
  payment_status?: string;
}

interface Payment {
  payment_id: number;
  booking_id: number;
  user_id: number;
  amount: number;
  method: string;
  status: string;
  transaction_id: string;
  vendor_name: string;
  created_at: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: number;
  desc: string;
  img: string;
  location: string;
  email?: string;
  reviews?: Review[];
}

// --- Components ---

const Navbar = ({ user, onLogout, setPage }: { user: UserData | null, onLogout: () => void, setPage: (p: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            <span className="ml-2 text-xl font-serif font-bold text-stone-800">EverAfter</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setPage('home')} className="text-stone-600 hover:text-rose-500 transition-colors">Home</button>
            <button onClick={() => setPage('about')} className="text-stone-600 hover:text-rose-500 transition-colors">About Us</button>
            <button onClick={() => setPage('contact')} className="text-stone-600 hover:text-rose-500 transition-colors">Contact</button>
            {!user ? (
              <>
                <button onClick={() => setPage('register')} className="text-stone-600 hover:text-rose-500 transition-colors">Register</button>
                <button onClick={() => setPage('login')} className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors shadow-sm">Login</button>
              </>
            ) : (
              <>
                <button onClick={() => setPage('dashboard')} className="text-stone-600 hover:text-rose-500 transition-colors">Vendors</button>
                <button onClick={() => setPage('favorites')} className="text-stone-600 hover:text-rose-500 transition-colors">Favorites</button>
                <button onClick={() => setPage('my-bookings')} className="text-stone-600 hover:text-rose-500 transition-colors">My Bookings</button>
                <button onClick={() => setPage('payments')} className="text-stone-600 hover:text-rose-500 transition-colors">Payments</button>
                <button onClick={() => setPage('budget')} className="text-stone-600 hover:text-rose-500 transition-colors">Budget</button>
                <button onClick={() => setPage('gallery')} className="text-stone-600 hover:text-rose-500 transition-colors">Gallery</button>
                <div className="flex items-center space-x-4 border-l pl-8 border-stone-200">
                  <button onClick={() => setPage('profile')} className="flex items-center gap-2 text-stone-800 font-bold hover:text-rose-500 transition-colors">
                    <User className="h-4 w-4" /> {user.name}
                  </button>
                  <button onClick={onLogout} className="text-stone-400 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-rose-50">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => { setPage('home'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Home</button>
              <button onClick={() => { setPage('about'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">About Us</button>
              <button onClick={() => { setPage('contact'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Contact</button>
              {!user ? (
                <>
                  <button onClick={() => { setPage('register'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Register</button>
                  <button onClick={() => { setPage('login'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-rose-500 font-bold">Login</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setPage('dashboard'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Vendors</button>
                  <button onClick={() => { setPage('favorites'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Favorites</button>
                  <button onClick={() => { setPage('my-bookings'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">My Bookings</button>
                  <button onClick={() => { setPage('payments'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Payments</button>
                  <button onClick={() => { setPage('budget'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Budget</button>
                  <button onClick={() => { setPage('gallery'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600">Gallery</button>
                  <button onClick={() => { setPage('profile'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-800 font-bold">Profile</button>
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-400">Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Page Components ---

const Profile = ({ user, setUser, showMessage }: { user: UserData | null, setUser: (u: UserData) => void, showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('wedding_user', JSON.stringify(data.user));
      showMessage('success', 'Profile updated successfully!');
      setIsEditing(false);
    } else {
      showMessage('error', data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-stone-100">
      <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6 text-center">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
          <input disabled={!isEditing} type="text" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-stone-50" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
          <input disabled={!isEditing} type="email" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-stone-50" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Phone Number</label>
          <input disabled={!isEditing} type="tel" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-stone-50" 
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        {isEditing ? (
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-stone-100 text-stone-600 py-3 rounded-lg font-bold hover:bg-stone-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-rose-500 text-white py-3 rounded-lg font-bold hover:bg-rose-600 transition-colors shadow-md">Save Changes</button>
          </div>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-stone-800 text-white py-3 rounded-lg font-bold hover:bg-stone-900 transition-colors mt-4">Edit Profile</button>
        )}
      </form>
    </div>
  );
};

const Favorites = ({ user, setPage, setSelectedVendorObject, favorites, toggleFavorite }: { user: UserData | null, setPage: (p: string) => void, setSelectedVendorObject: (v: Vendor) => void, favorites: number[], toggleFavorite: (id: number) => void }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  useEffect(() => {
    fetch('/api/vendors')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setVendors)
      .catch(err => {
        console.error('Failed to load vendors:', err);
        setVendors([]);
      });
  }, []);

  const favoriteVendors = vendors.filter(v => favorites.includes(v.id));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15 } }
  };

  return (
    <motion.div className="max-w-7xl mx-auto px-4 py-12" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
        <motion.h2 className="text-3xl font-serif font-bold text-stone-800" whileHover={{ scale: 1.02 }}>My Favorites</motion.h2>
        <motion.button onClick={() => setPage('dashboard')} className="text-rose-500 font-bold hover:underline" whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>Back to All Vendors</motion.button>
      </motion.div>
      
      {favoriteVendors.length === 0 ? (
        <motion.div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-stone-200" variants={itemVariants}>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-stone-500">No favorite vendors yet. Start exploring!</p>
        </motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants}>
          {favoriteVendors.map((v) => (
            <motion.div 
              key={v.id}
              layout
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <motion.img src={v.img} alt={v.name} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }} referrerPolicy="no-referrer" />
                <motion.button 
                  onClick={() => toggleFavorite(v.id)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-rose-500"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
                    <Heart className="h-5 w-5 fill-rose-500" />
                  </motion.div>
                </motion.button>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-stone-800 mb-2">{v.name}</h3>
                <p className="text-stone-500 text-sm mb-6 line-clamp-2 flex-1">{v.desc}</p>
                <motion.button 
                  onClick={() => { setSelectedVendorObject(v); setPage('vendor-details'); }}
                  className="w-full bg-stone-800 text-white py-2 rounded-lg font-bold hover:bg-rose-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
const Home = ({ setPage }: { setPage: (p: string) => void }) => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative text-center px-4"
    >
      <motion.h1 
        className="text-5xl md:text-7xl font-serif font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Plan Your Dream Wedding
      </motion.h1>
      <motion.p 
        className="text-xl text-stone-200 mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Everything you need to create your perfect day, all in one place. Connect with top vendors and manage your bookings effortlessly.
      </motion.p>
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.button 
          onClick={() => setPage('register')} 
          className="bg-rose-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(244,63,94,0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
        <motion.button 
          onClick={() => setPage('dashboard')} 
          className="bg-white text-stone-800 px-8 py-4 rounded-full text-lg font-bold shadow-lg"
          whileHover={{ scale: 1.1, backgroundColor: '#f1f5f9' }}
          whileTap={{ scale: 0.95 }}
        >
          Browse Vendors
        </motion.button>
      </motion.div>
    </motion.div>
  </div>
);

const AboutUs = ({ setPage }: { setPage: (p: string) => void }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 via-white to-stone-50 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-stone-900 mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Your Love Story,<br />Perfectly Planned
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Meet the platform that makes wedding planning feel less like a checklist and more like the adventure it should be
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 flex gap-6 justify-center flex-wrap"
          >
            <motion.button 
              onClick={() => setPage('dashboard')}
              className="bg-rose-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(244,63,94,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button 
              onClick={() => setPage('contact')}
              className="border-2 border-stone-900 text-stone-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-stone-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Large Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative h-80 md:h-96 overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000&h=600" 
          alt="Wedding Ceremony" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Story Section */}
      <div className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-6">OUR STORY</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-tight">We Started With One Question</h2>
              </div>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  Why should planning the most important day of your life feel so complicated?
                </p>
                <p>
                  Three years ago, our founder attended her sister's wedding and watched the chaos unfold – vendor calls that went unanswered, spreadsheets that never got updated, and a couple too stressed to actually enjoy the planning process.
                </p>
                <p>
                  That's when it clicked. We built EverAfter not as another generic marketplace, but as a true partner in planning. We handle the logistics so you can focus on what matters: celebrating with the people you love.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800&h=700" 
                alt="Planning Together" 
                className="rounded-3xl shadow-2xl w-full h-96 md:h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Second Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative h-80 md:h-96 overflow-hidden"
      >
        <img 
          src="https://suzygoodrick.com/wp-content/uploads/2020/03/What-to-include-in-detail-photos_0014-1600x1067.jpg" 
          alt="Wedding Details" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Why Different Section */}
      <div className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-6">HOW WE'RE DIFFERENT</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-6">Built For Real Couples,<br />Not Algorithms</h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">Every feature comes from real wedding planning stories, not corporate guesswork</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: '🎯', title: 'Smart Matching', desc: 'Find vendors that match YOUR preferences, not just budget' },
              { icon: '💬', title: 'Real Reviews', desc: 'Honest feedback from real couples, not fake testimonials' },
              { icon: '🤝', title: 'We Handle It', desc: 'Contracts, timelines, payments – we manage the details' },
              { icon: '📞', title: 'Real Support', desc: 'Get actual humans, not bots, when you need help' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white p-10 rounded-2xl shadow-lg border border-stone-100 hover:border-rose-300 transition-colors"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-rose-500 to-pink-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center text-white">
            {[
              { number: '500+', label: 'Handpicked Vendors', sub: 'Verified, not just listed' },
              { number: '1000+', label: 'Happy Couples', sub: 'Real weddings, real stories' },
              { number: '4.9★', label: 'Average Rating', sub: 'Because we care' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: idx * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl md:text-7xl font-bold mb-3">{stat.number}</div>
                <p className="text-xl md:text-2xl font-semibold mb-2">{stat.label}</p>
                <p className="text-pink-100 text-sm">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-6">SUCCESS STORIES</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900">Couples We've Helped</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah & Mike', quote: 'Found our dream photographer in literally 2 hours', time: 'June 2025' },
              { name: 'Jessica & David', quote: 'The stress disappeared. Actually enjoyed planning', time: 'August 2025' },
              { name: 'Emily & James', quote: 'Every vendor was professional and perfect fit', time: 'October 2025' }
            ].map((story, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="bg-stone-50 p-8 rounded-2xl border-2 border-stone-200 hover:border-rose-300 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-lg text-stone-800 font-medium italic mb-6">"{story.quote}"</p>
                <div className="border-t-2 border-stone-200 pt-4">
                  <p className="font-bold text-stone-900">{story.name}</p>
                  <p className="text-stone-500 text-sm">{story.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-stone-900 via-stone-800 to-black text-white">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold"
          >
            Ready to Plan Your Wedding?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Join thousands of couples who've already simplified their wedding planning journey
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
          >
            <motion.button 
              onClick={() => setPage('dashboard')} 
              className="bg-linear-to-r from-rose-500 to-pink-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-2xl"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Vendors
            </motion.button>
            <motion.button 
              onClick={() => setPage('contact')} 
              className="bg-white/20 backdrop-blur border-2 border-white text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Contact = ({ showMessage }: { showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Your message has been sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showMessage('error', data.message || 'Failed to send message');
      }
    } catch (error) {
      showMessage('error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 via-white to-stone-50 overflow-hidden pt-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-900 mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Let's Talk About Your Wedding
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Have questions? We're here to help. Reach out and let us know how we can assist with your wedding planning
          </motion.p>
        </motion.div>
      </div>

      {/* Contact Info Cards - Top Section */}
      <div className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📧', label: 'Email', value: 'medtrust@gmail.com', desc: 'We respond within 2 hours' },
              { icon: '📱', label: 'Phone', value: '+91 77099 70972', desc: 'Mon-Fri, 9am-6pm IST' },
              { icon: '📍', label: 'Office', value: '123 Wedding Lane, Pune 411201', desc: 'Visit us in person' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-linear-to-br from-rose-50 to-pink-50 p-10 rounded-2xl border-2 border-rose-100 hover:border-rose-300 transition-all text-center"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">{item.label}</h3>
                <p className="text-lg font-semibold text-rose-600 mb-2">{item.value}</p>
                <p className="text-stone-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Contact Form */}
      <div className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-stone-600">Fill out the form below and we'll get back to you shortly</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-bold text-stone-800 mb-3">Your Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  className="w-full px-6 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-bold text-stone-800 mb-3">Your Email *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <label className="block text-sm font-bold text-stone-800 mb-3">Subject *</label>
              <input 
                type="text" 
                required 
                placeholder="What is this about?"
                className="w-full px-6 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all" 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <label className="block text-sm font-bold text-stone-800 mb-3">Your Message *</label>
              <textarea 
                required 
                placeholder="Tell us everything..."
                rows={6}
                className="w-full px-6 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 resize-none transition-all" 
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
              />
            </motion.div>

            <motion.button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-linear-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Sending your message...' : 'Send Message'}
            </motion.button>

            <p className="text-center text-stone-500 text-sm">We'll respond within 24 hours during business days</p>
          </motion.form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-4">Quick Answers</h2>
            <p className="text-xl text-stone-600">Common questions couples ask us</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { q: 'How quickly do you respond to inquiries?', a: 'We aim to respond to all messages within 2 hours during business hours. Non-urgent inquiries typically get responses within 24 hours.' },
              { q: 'Can I meet someone from your team?', a: 'Absolutely! We offer in-person meetings by appointment at our New York office. Call us to schedule a time that works for you.' },
              { q: 'What if I have a specific vendor question?', a: 'Our team has expertise across photography, catering, venues, florals, and more. Contact us with your specific needs and we\'ll connect you with the right vendor.' },
              { q: 'Do you offer 24/7 support?', a: 'We\'re available Monday to Friday, 9am-6pm EST. For urgent matters outside these hours, email us and we\'ll prioritize your message.' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-stone-50 p-8 rounded-2xl border-2 border-stone-200 hover:border-rose-300 transition-all"
              >
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3">❓ {item.q}</h3>
                <p className="text-stone-600 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-stone-900 via-stone-800 to-black text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300"
          >
            Explore our vendors or get in touch with any questions. We're excited to help bring your wedding dreams to life
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
          >
            <motion.button 
              onClick={() => location.href = '/'} 
              className="bg-linear-to-r from-rose-500 to-pink-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-2xl"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Home
            </motion.button>
            <motion.button 
              onClick={() => location.href = '#'} 
              className="bg-white/20 backdrop-blur border-2 border-white text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Vendors
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Register = ({ setPage, showMessage }: { setPage: (p: string) => void, showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const localUsers = JSON.parse(localStorage.getItem('wedding_mock_users') || '[]');
    if (localUsers.find((u: any) => u.email === formData.email)) {
      showMessage('error', 'Email already exists');
      return;
    }
    
    // Always save to localStorage to persist across Vercel reloads
    const newId = Date.now();
    localUsers.push({ id: newId, ...formData });
    localStorage.setItem('wedding_mock_users', JSON.stringify(localUsers));

    // Fire & forget to backend if available
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch(e=>e);

    showMessage('success', 'Registration successful! Please login.');
    setPage('login');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 via-white to-stone-50 overflow-hidden pt-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-4">Start Your<br />Wedding Journey</h1>
                <p className="text-xl text-stone-600 leading-relaxed">Join thousands of couples planning their perfect day with EverAfter. Create your account in seconds.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: '💍', title: 'Access 500+ Vendors', desc: 'Browse and book the best wedding professionals' },
                  { icon: '📝', title: 'Manage Bookings', desc: 'Keep all your contracts and timelines organized' },
                  { icon: '⭐', title: 'Save Favorites', desc: 'Create wishlists and compare vendors easily' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="text-4xl shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-stone-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-10 md:p-12"
            >
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 text-center">Create Account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-bold text-stone-800 mb-3">Full Name *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Jerry & Cherry"
                    className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all"
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-bold text-stone-800 mb-3">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all"
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-stone-800 mb-3">Password *</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all"
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-bold text-stone-800 mb-3">Phone Number *</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="+91 77099 70972"
                    className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all"
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </motion.div>

                <motion.button 
                  type="submit" 
                  className="w-full bg-linear-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition-all mt-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Create Account
                </motion.button>
              </form>

              <p className="text-center text-stone-600 mt-6">Already have an account? <button onClick={() => setPage('login')} className="text-rose-500 font-bold hover:text-rose-600 transition-colors">Login here</button></p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = ({ setPage, setUser, showMessage }: { setPage: (p: string) => void, setUser: (u: UserData) => void, showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check localStorage first
    const localUsers = JSON.parse(localStorage.getItem('wedding_mock_users') || '[]');
    const localUser = localUsers.find((u: any) => u.email === formData.email && u.password === formData.password);
    
    if (localUser) {
      setUser(localUser);
      localStorage.setItem('wedding_user', JSON.stringify(localUser));
      setPage('dashboard');
      return;
    } else if (formData.email === 'demo@example.com' && formData.password === 'demo123') {
      const demoUser = { id: 1, name: 'Demo User', email: 'demo@example.com', phone: '9999999999' };
      setUser(demoUser);
      localStorage.setItem('wedding_user', JSON.stringify(demoUser));
      setPage('dashboard');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('wedding_user', JSON.stringify(data.user));
        setPage('dashboard');
      } else {
        showMessage('error', data.message || 'Invalid credentials');
      }
    } catch (err) {
      showMessage('error', 'Invalid credentials');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 via-white to-stone-50 overflow-hidden pt-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side - Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-10 md:p-12 order-2 md:order-1"
            >
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2 text-center">Welcome Back</h2>
              <p className="text-center text-stone-600 mb-8">Sign in to your EverAfter account</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-bold text-stone-800 mb-3">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all"
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-bold text-stone-800 mb-3">Password *</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-5 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-stone-900 placeholder-stone-400 transition-all"
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </motion.div>

                <motion.button 
                  type="submit" 
                  className="w-full bg-linear-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition-all mt-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Sign In
                </motion.button>
              </form>

              <p className="text-center text-stone-600 mt-6">Don't have an account? <button onClick={() => setPage('register')} className="text-rose-500 font-bold hover:text-rose-600 transition-colors">Register here</button></p>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 order-1 md:order-2"
            >
              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-4">Plan Your Perfect<br />Wedding</h1>
                <p className="text-xl text-stone-600 leading-relaxed">Sign in to access your vendor bookings, favorites, and wedding timeline all in one place.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: '🎯', title: 'Your Vendors', desc: 'Track all your bookings and timelines' },
                  { icon: '💕', title: 'Saved Favorites', desc: 'Access your curated vendor wishlists' },
                  { icon: '📊', title: 'Wedding Dashboard', desc: 'Manage budgets and stay organized' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="text-4xl shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-stone-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, setPage, setSelectedVendorObject, favorites, toggleFavorite }: { user: UserData | null, setPage: (p: string) => void, setSelectedVendorObject: (v: Vendor) => void, favorites: number[], toggleFavorite: (id: number) => void }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });

  useEffect(() => {
    fetch('/api/vendors')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Vendors loaded:', data);
        setVendors(data || []);
      })
      .catch(err => {
        console.error('Failed to load vendors:', err);
        // Fallback: hardcoded vendors
        setVendors([
          { id: 1, name: 'Vibrant Visions Photography', category: 'Photographer', rating: 4.9, price: 75000, desc: 'Capturing the essence of Indian weddings with cinematic brilliance.', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=600', location: 'Mumbai, Maharashtra', email: 'contact@vibrantvisions.in', reviews: [{ user: 'Ananya S.', rating: 5, comment: 'Absolutely amazing work! They captured every emotion perfectly.' }, { user: 'Rahul M.', rating: 4, comment: 'Great quality, but a bit expensive.' }] },
          { id: 2, name: 'Spice Route Catering', category: 'Caterer', rating: 4.8, price: 800, desc: 'Authentic Indian flavors and international cuisines for your grand feast.', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600', location: 'Delhi, NCR', email: 'info@spiceroute.com', reviews: [{ user: 'Priya K.', rating: 5, comment: 'The food was the highlight of our wedding. Everyone loved it!' }] },
          { id: 3, name: 'Royal Mandap Decorators', category: 'Decorator', rating: 4.7, price: 150000, desc: 'Traditional and contemporary wedding decor that feels like royalty.', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600', location: 'Bangalore, Karnataka', email: 'royal@mandap.in', reviews: [{ user: 'Suresh V.', rating: 4, comment: 'Beautiful setup, though they were slightly late for the setup.' }] },
          { id: 4, name: 'Shringar Bridal Studio', category: 'Makeup Artist', rating: 4.9, price: 25000, desc: 'Expert bridal makeup and styling for the perfect traditional look.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600', location: 'Chennai, Tamil Nadu', email: 'shringar@beauty.com', reviews: [{ user: 'Meera R.', rating: 5, comment: 'I felt like a queen! Thank you for the amazing makeover.' }] },
          { id: 5, name: 'Eternal Frames', category: 'Photographer', rating: 4.6, price: 60000, desc: 'Candid photography that captures every emotion of your special day.', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', location: 'Pune, Maharashtra', email: 'eternal@frames.in', reviews: [] },
          { id: 6, name: 'The Great Indian Kitchen', category: 'Caterer', rating: 4.5, price: 1200, desc: 'Exquisite multi-cuisine catering for weddings and large events.', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600', location: 'Hyderabad, Telangana', email: 'kitchen@greatindian.com', reviews: [] },
          { id: 7, name: 'Utsav Event Planners', category: 'Decorator', rating: 4.8, price: 250000, desc: 'Bespoke wedding planning and grand venue decorations.', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600', location: 'Jaipur, Rajasthan', email: 'utsav@events.in', reviews: [] },
          { id: 8, name: 'Apsara Beauty Lounge', category: 'Makeup Artist', rating: 4.7, price: 35000, desc: 'Luxury bridal makeovers and pre-wedding grooming services.', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600', location: 'Kolkata, West Bengal', email: 'apsara@beauty.in', reviews: [] },
          { id: 9, name: 'Grand Ballroom Venues', category: 'Venue', rating: 4.8, price: 200000, desc: 'Luxurious banquet halls with traditional and modern architecture in heart of the city.', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600', location: 'Chennai, Tamil Nadu', email: 'info@grandballroom.in', reviews: [{ user: 'Vikram K.', rating: 5, comment: 'Perfect venue with excellent staff support!' }] },
          { id: 10, name: 'Sunshine Banquet Palace', category: 'Venue', rating: 4.6, price: 150000, desc: 'Traditional North Indian style banquet with world-class facilities and catering services.', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600', location: 'Lucknow, Uttar Pradesh', email: 'info@sunshinebanquet.in', reviews: [] },
          { id: 11, name: 'Melody Music & DJ Co.', category: 'DJ/Music', rating: 4.9, price: 45000, desc: 'Professional DJs and live musicians for all Indian wedding occasions with classical to modern beats.', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600', location: 'Delhi, NCR', email: 'info@melodymusic.in', reviews: [{ user: 'Deepak S.', rating: 5, comment: 'Incredible sound system and amazing playlist management!' }] },
          { id: 12, name: 'DJ Rajesh Productions', category: 'DJ/Music', rating: 4.7, price: 35000, desc: 'High-energy DJ services with modern light shows perfect for sangeet and reception.', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600', location: 'Bangalore, Karnataka', email: 'rajesh@djproductions.in', reviews: [] },
          { id: 13, name: 'Maharani Bridal Couture', category: 'Bridal Wear', rating: 4.9, price: 150000, desc: 'Exquisite bridal lehengas, sarees and designer wedding attire with custom stitching.', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', location: 'Ahmedabad, Gujarat', email: 'info@maharanibridal.in', reviews: [{ user: 'Neha P.', rating: 5, comment: 'The finest lehengas I have ever seen. Perfect fit and beautiful designs!' }] },
          { id: 14, name: 'Royal Designer Collection', category: 'Bridal Wear', rating: 4.6, price: 120000, desc: 'Traditional and contemporary bridal wear for all Indian weddings with premium fabrics.', img: 'https://images.unsplash.com/photo-1582053577922-40da08e86fef?auto=format&fit=crop&q=80&w=600', location: 'Mumbai, Maharashtra', email: 'orders@royaldesigner.in', reviews: [] },
          { id: 15, name: 'Jewels & Gems Palace', category: 'Jewelry', rating: 4.8, price: 200000, desc: 'Authentic gold and diamond jewelry with certified precious stones for Indian weddings.', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600', location: 'Jaipur, Rajasthan', email: 'sales@jewelsgems.in', reviews: [{ user: 'Anjali M.', rating: 5, comment: 'Outstanding jewelry designs and perfect craftsmanship!' }] },
          { id: 16, name: 'Golden Touch Jewelers', category: 'Jewelry', rating: 4.7, price: 180000, desc: 'Premium bridal jewelry sets including bangles, necklaces and traditional ornaments.', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', location: 'Pune, Maharashtra', email: 'orders@goldentouch.in', reviews: [] },
          { id: 17, name: 'Floral Dreams Decorators', category: 'Decorator', rating: 4.8, price: 120000, desc: 'Fresh flower arrangements, traditional mandap decor and stage decorations.', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600', location: 'Hyderabad, Telangana', email: 'info@floraldecorators.in', reviews: [] },
          { id: 18, name: 'Shri Wedding Planners', category: 'Event Planner', rating: 4.9, price: 100000, desc: 'Complete wedding management from theme selection to day-of coordination with zero stress.', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600', location: 'Surat, Gujarat', email: 'info@shriplanners.in', reviews: [{ user: 'Radhika V.', rating: 5, comment: 'They managed everything flawlessly. Our wedding was a dream!' }] },
          { id: 19, name: 'Golden Occasions Events', category: 'Event Planner', rating: 4.7, price: 85000, desc: 'Expert wedding planning with attention to every detail and Indian traditions.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', location: 'Indore, Madhya Pradesh', email: 'contact@goldenoccasions.in', reviews: [] },
          { id: 20, name: 'Spice & Taste Catering', category: 'Caterer', rating: 4.9, price: 900, desc: 'Authentic Rajasthani, Gujarati and Punjabi cuisines with modern presentation.', img: 'https://images.unsplash.com/photo-1565123409695-7b5ef63df2efafbe7adfb72a265bbb50?auto=format&fit=crop&q=80&w=600', location: 'Udaipur, Rajasthan', email: 'bookings@spicetaste.in', reviews: [{ user: 'Rajesh P.', rating: 5, comment: 'Best Rajasthani food for our wedding. Guests loved every dish!' }] },
          { id: 21, name: 'North Star Photographer', category: 'Photographer', rating: 4.8, price: 80000, desc: 'Cinematic wedding videography with drone shots and same-day editing.', img: 'https://images.unsplash.com/photo-1570303008313-7e23cfb007cb?auto=format&fit=crop&q=80&w=600', location: 'New Delhi, Delhi', email: 'studio@northstar.in', reviews: [] },
          { id: 22, name: 'Classic Moments Photography', category: 'Photographer', rating: 4.7, price: 70000, desc: 'Traditional and candid wedding photography capturing every precious moment.', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600', location: 'Nashik, Maharashtra', email: 'contact@classicmoments.in', reviews: [] },
          { id: 23, name: 'Sindoor Makeup Studio', category: 'Makeup Artist', rating: 4.9, price: 40000, desc: 'Bridal and groom makeup with HD quality coverage and organic products.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600', location: 'Goa', email: 'bookings@sindoor.in', reviews: [{ user: 'Priya R.', rating: 5, comment: 'My makeup lasted the entire wedding without a single touch-up!' }] },
          { id: 24, name: 'Bridal Beauty Parlor', category: 'Makeup Artist', rating: 4.6, price: 32000, desc: 'Expert bridal and party makeup with skincare and pre-wedding treatments.', img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600', location: 'Vadodara, Gujarat', email: 'salon@bridalbeauty.in', reviews: [] },
          { id: 25, name: 'Royal Feast Catering', category: 'Caterer', rating: 4.8, price: 850, desc: 'Multi-cuisine catering with South Indian specialties and continental options.', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600', location: 'Kochi, Kerala', email: 'events@royalfeast.in', reviews: [] },
          { id: 26, name: 'Invitations by Design', category: 'Stationery', rating: 4.7, price: 15000, desc: 'Custom wedding invitation cards with traditional Indian designs and personalization.', img: 'https://images.unsplash.com/photo-1595776119443-d06dafcdcc15?auto=format&fit=crop&q=80&w=600', location: 'Indore, Madhya Pradesh', email: 'design@invitationsbydesign.in', reviews: [] },
          { id: 27, name: 'Wedding Cards Premium', category: 'Stationery', rating: 4.6, price: 12000, desc: 'Eco-friendly wedding cards with intricate designs and gold foil printing.', img: 'https://images.unsplash.com/photo-1590308470209-9634a4e90c34?auto=format&fit=crop&q=80&w=600', location: 'Lucknow, Uttar Pradesh', email: 'orders@cardspremium.in', reviews: [] },
          { id: 28, name: 'Heritage Havelis Venue', category: 'Venue', rating: 4.9, price: 250000, desc: 'Stunning heritage havelis and forts perfect for destination Indian weddings.', img: 'https://images.unsplash.com/photo-1519222220978-813980954a7f?auto=format&fit=crop&q=80&w=600', location: 'Jaisalmer, Rajasthan', email: 'bookings@heritagehavelis.in', reviews: [{ user: 'Vikas K.', rating: 5, comment: 'A fairy tale wedding in the most beautiful venue!' }] },
          { id: 29, name: 'Symphony Orchestra Services', category: 'DJ/Music', rating: 4.8, price: 120000, desc: 'Live orchestra and classical musicians for engagement and mehendi ceremonies.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', location: 'Mumbai, Maharashtra', email: 'bookings@symphonyorchestra.in', reviews: [] },
          { id: 30, name: 'Mehendi Palace', category: 'Bridal Wear', rating: 4.8, price: 80000, desc: 'Beautiful mehendi dresses and casual wedding wear with contemporary designs.', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600', location: 'Surat, Gujarat', email: 'style@mehendipalace.in', reviews: [] }
        ]);
      });
  }, []);

  const categories = ['All', 'Photographer', 'Caterer', 'Decorator', 'Makeup Artist', 'Venue', 'DJ/Music', 'Bridal Wear', 'Jewelry', 'Event Planner', 'Stationery'];

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesPrice = v.price >= priceRange.min && v.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-800 mb-2">Welcome, {user?.name || 'Guest'}</h2>
          <p className="text-stone-500">Find and book the best vendors for your wedding.</p>
        </div>
        {user && (
          <div className="flex gap-4 flex-wrap">
            <button onClick={() => setPage('favorites')} className="flex items-center gap-2 text-rose-500 font-bold hover:underline">
              <Heart className="h-5 w-5" /> My Favorites
            </button>
            <button onClick={() => setPage('my-bookings')} className="flex items-center gap-2 text-rose-500 font-bold hover:underline">
              <Calendar className="h-5 w-5" /> My Bookings
            </button>
            <button onClick={() => setPage('budget')} className="flex items-center gap-2 text-rose-500 font-bold hover:underline">
              <DollarSign className="h-5 w-5" /> Budget
            </button>
            <button onClick={() => setPage('gallery')} className="flex items-center gap-2 text-rose-500 font-bold hover:underline">
              📸 Gallery
            </button>
          </div>
        )}
      </div>

      {/* Search and Filter UI */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-end md:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search vendors, services..." 
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-5 w-5 text-stone-400 hidden md:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 font-medium focus:ring-2 focus:ring-rose-500 outline-none transition-all w-full md:w-48"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="pt-4 border-t border-stone-100">
          <label className="block text-sm font-medium text-stone-600 mb-4">Price Range (₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()})</label>
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="1000"
            className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            value={priceRange.max}
            onChange={e => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
          />
        </div>
      </div>

      {/* Vendor Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
          }
        }}
      >
        {filteredVendors.length > 0 ? (
          filteredVendors.map((v) => (
            <motion.div 
              key={v.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-rose-500 shadow-sm">{v.category}</div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {user && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(v.id); }}
                      className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm text-rose-500 hover:bg-white transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(v.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                  )}
                  <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-stone-800">{v.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-stone-800 leading-tight">{v.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-stone-400 text-xs mb-4">
                  <MapPin className="h-3 w-3" />
                  {v.location}
                </div>
                <p className="text-stone-500 text-sm mb-6 line-clamp-2 flex-1">{v.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-stone-800 font-bold text-lg">
                    ₹{v.price.toLocaleString()} <span className="text-stone-400 text-xs font-normal">/ starting</span>
                  </div>
                  <motion.button 
                    onClick={() => { setSelectedVendorObject(v); setPage('vendor-details'); }}
                    className="bg-stone-800 text-white p-2 rounded-lg hover:bg-rose-500 transition-colors shadow-sm"
                    whileHover={{ scale: 1.15, rotate: 5, backgroundColor: '#f43b5a' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Info className="h-5 w-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="col-span-full py-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className="bg-stone-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Search className="h-10 w-10 text-stone-300" />
            </motion.div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">No vendors found</h3>
            <p className="text-stone-500">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const VendorDetails = ({ vendor, setPage, user, favorites, toggleFavorite }: { vendor: Vendor | null, setPage: (p: string) => void, user: UserData | null, favorites: number[], toggleFavorite: (id: number) => void }) => {
  if (!vendor) return null;

  const handleContact = () => {
    const subject = encodeURIComponent(`Inquiry for Wedding Services - ${vendor.name}`);
    const body = encodeURIComponent(`Hello ${vendor.name},\n\nI am interested in your services for my upcoming wedding. Could you please provide more details about your packages and availability?\n\nThank you,\n${user?.name || 'Interested Client'}`);
    window.location.href = `mailto:${vendor.email || 'contact@everafter.in'}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors font-medium">
          <ArrowLeft className="h-5 w-5" /> Back to Vendors
        </button>
        {user && (
          <button 
            onClick={() => toggleFavorite(vendor.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              favorites.includes(vendor.id) 
                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${favorites.includes(vendor.id) ? 'fill-rose-500' : ''}`} />
            {favorites.includes(vendor.id) ? 'Favorited' : 'Add to Favorites'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-96">
          <div className="h-64 md:h-auto">
            <img src={vendor.img} alt={vendor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{vendor.category}</span>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                <Star className="h-3 w-3 fill-amber-600" /> {vendor.rating}
              </div>
            </div>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">{vendor.name}</h2>
            <div className="flex items-center gap-2 text-stone-500 mb-8">
              <MapPin className="h-5 w-5 text-rose-500" />
              {vendor.location}
            </div>
            
            <div className="bg-stone-50 p-6 rounded-2xl mb-8">
              <h3 className="font-bold text-stone-800 mb-2">About this Vendor</h3>
              <p className="text-stone-600 leading-relaxed">{vendor.desc}</p>
            </div>

            <div className="mt-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-8 border-t border-stone-100">
              <div className="mb-4 lg:mb-0">
                <p className="text-stone-400 text-sm">Starting from</p>
                <p className="text-3xl font-bold text-stone-800">₹{vendor.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button 
                  onClick={handleContact}
                  className="border-2 border-stone-800 text-stone-800 px-6 py-3 rounded-xl font-bold hover:bg-stone-800 hover:text-white transition-all whitespace-nowrap text-sm sm:text-base"
                >
                  Contact Vendor
                </button>
                <button 
                  onClick={() => user ? setPage('booking') : setPage('login')}
                  className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 whitespace-nowrap text-sm sm:text-base"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <motion.div 
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-stone-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-8">User Reviews & Ratings</h3>
        {vendor.reviews && vendor.reviews.length > 0 ? (
          <motion.div 
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {vendor.reviews.map((rev, i) => (
              <motion.div 
                key={i} 
                className="border-b border-stone-100 last:border-0 pb-8 last:pb-0"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-bold"
                      whileHover={{ scale: 1.15, backgroundColor: '#e7e5e4' }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      {rev.user[0]}
                    </motion.div>
                    <div>
                      <p className="font-bold text-stone-800">{rev.user}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, starI) => (
                          <motion.div 
                            key={starI} 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: starI * 0.05 }}
                          >
                            <Star className={`h-3 w-3 ${starI < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-stone-600 italic">"{rev.comment}"</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <Star className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            </motion.div>
            <p className="text-stone-500">No reviews yet for this vendor.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const BookingPage = ({ user, selectedVendor, setPage, showMessage, setLastBookingId }: { user: UserData | null, selectedVendor: Vendor | null, setPage: (p: string) => void, showMessage: (type: 'success' | 'error', text: string) => void, setLastBookingId: (id: number) => void }) => {
  const [formData, setFormData] = useState({ date: '', budget: '' });
  
  if (!selectedVendor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Write-through cache: Always save to localStorage immediately
    const localBookings = JSON.parse(localStorage.getItem('wedding_mock_bookings') || '[]');
    const newBookingId = Date.now();
    localBookings.push({
      booking_id: newBookingId,
      user_id: String(user?.id),
      vendor_name: selectedVendor.name,
      booking_date: formData.date,
      budget: parseFloat(formData.budget),
      payment_status: 'pending'
    });
    localStorage.setItem('wedding_mock_bookings', JSON.stringify(localBookings));
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          vendorName: selectedVendor.name,
          date: formData.date,
          budget: parseFloat(formData.budget)
        })
      });
      const data = await res.json();
      setLastBookingId(data.success ? data.bookingId : newBookingId);
    } catch {
      setLastBookingId(newBookingId);
    }
    setPage('payment');
  };

  return (
    <motion.div 
      className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-stone-100"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="bg-rose-100 p-3 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Calendar className="h-6 w-6 text-rose-500" />
        </motion.div>
        <h2 className="text-3xl font-serif font-bold text-stone-800">Book {selectedVendor.name}</h2>
      </motion.div>
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
          }
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <label className="block text-sm font-medium text-stone-600 mb-1">Wedding Date</label>
          <motion.input 
            required 
            type="date" 
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
            onChange={e => setFormData({...formData, date: e.target.value})}
            whileFocus={{ borderColor: '#f43b5a', boxShadow: '0 0 0 3px rgba(244, 59, 90, 0.1)' }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <label className="block text-sm font-medium text-stone-600 mb-1">Estimated Budget (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
            <motion.input 
              required 
              type="number" 
              min={selectedVendor.price} 
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
              placeholder={`Min ₹${selectedVendor.price.toLocaleString()}`}
              onChange={e => setFormData({...formData, budget: e.target.value})}
              whileFocus={{ borderColor: '#f43b5a', boxShadow: '0 0 0 3px rgba(244, 59, 90, 0.1)' }}
            />
          </div>
          <p className="text-[10px] text-stone-400 mt-1">Vendor's starting price is ₹{selectedVendor.price.toLocaleString()}</p>
        </motion.div>
        <motion.div 
          className="pt-4 flex gap-4"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <motion.button 
            type="button" 
            onClick={() => setPage('vendor-details')} 
            className="flex-1 bg-stone-100 text-stone-600 py-3 rounded-lg font-bold hover:bg-stone-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            type="submit" 
            className="flex-2 bg-rose-500 text-white py-3 px-8 rounded-lg font-bold hover:bg-rose-600 transition-colors shadow-md"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(244, 59, 90, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Confirm Booking
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

const PaymentPage = ({ user, selectedVendor, bookingId, setPage, showMessage }: { user: UserData | null, selectedVendor: Vendor | null, bookingId: number | null, setPage: (p: string) => void, showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('SBI');

  if (!selectedVendor || !bookingId) return null;
  const amount = selectedVendor.price;

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    const methodStr = paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking';
    
    // Write-through cache: Always save to localStorage immediately
    const localPayments = JSON.parse(localStorage.getItem('wedding_mock_payments') || '[]');
    localPayments.push({
      payment_id: Date.now(),
      booking_id: bookingId,
      user_id: String(user?.id),
      amount,
      method: methodStr,
      status: 'success',
      transaction_id: 'TXN' + Math.random().toString().slice(2, 10),
      vendor_name: selectedVendor.name,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('wedding_mock_payments', JSON.stringify(localPayments));
    
    // Update local booking status
    const localBookings = JSON.parse(localStorage.getItem('wedding_mock_bookings') || '[]');
    const bookingIndex = localBookings.findIndex((b: any) => b.booking_id === bookingId);
    if (bookingIndex > -1) {
      localBookings[bookingIndex].payment_status = 'paid';
      localStorage.setItem('wedding_mock_bookings', JSON.stringify(localBookings));
    }

    try {
      fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          userId: user?.id,
          amount,
          method: methodStr,
          vendorName: selectedVendor.name
        })
      }).catch(e=>e);
    } catch {}

    showMessage('success', `Payment of ₹${amount.toLocaleString()} successful!`);
    setPage('confirmation');
    setProcessing(false);
  };

  const methodTabClass = (m: string) =>
    `flex-1 py-3 text-sm font-bold rounded-xl transition-all ${paymentMethod === m ? 'bg-rose-500 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`;

  if (processing) {
    return (
      <motion.div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-3xl shadow-2xl border border-stone-100 text-center"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <motion.div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8"
          animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <CreditCard className="w-10 h-10 text-rose-500" />
        </motion.div>
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">Processing Payment...</h2>
        <p className="text-stone-500">Please wait while we securely process your payment</p>
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-3 h-3 bg-rose-500 rounded-full"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="max-w-6xl mx-auto mt-12 px-4 pb-24"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setPage('booking')} className="p-3 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-stone-700" />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Secure Checkout</h1>
          <p className="text-stone-500 text-lg mt-1">Complete your booking with {selectedVendor.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Security Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-xl">
            <Shield className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-emerald-800 font-bold">Safe & Secure Payment</p>
              <p className="text-emerald-600 text-sm">Your transaction is protected by 256-bit SSL encryption</p>
            </div>
          </div>

          {/* Method Tabs */}
          <div className="bg-stone-100 p-2 rounded-2xl flex gap-2">
            {(['card', 'upi', 'netbanking'] as const).map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 py-4 text-base font-bold rounded-xl transition-all ${paymentMethod === m ? 'bg-rose-500 text-white shadow-lg scale-[1.02]' : 'text-stone-600 hover:bg-stone-200 hover:scale-100'}`}>
                {m === 'card' ? '💳 Credit/Debit Card' : m === 'upi' ? '📱 UPI Options' : '🏦 Net Banking'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === 'card' && (
              <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6 shadow-sm">
                {/* Card Preview */}
                <div className="h-44 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-700 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-10 -translate-x-10" />
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-6">Credit / Debit Card</p>
                  <p className="text-white text-lg font-mono tracking-widest mb-4">
                    {cardData.number ? cardData.number.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/60 text-xs">Cardholder</p>
                      <p className="text-white font-bold text-sm">{cardData.name || 'YOUR NAME'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Expires</p>
                      <p className="text-white font-bold text-sm">{cardData.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-2">CARD NUMBER</label>
                  <input type="text" maxLength={16} placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-rose-400 outline-none font-mono"
                    value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g,'')})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-2">CARDHOLDER NAME</label>
                  <input type="text" placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-rose-400 outline-none"
                    value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-2">EXPIRY DATE</label>
                    <input type="text" placeholder="MM/YY" maxLength={5}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-rose-400 outline-none"
                      value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-2">CVV</label>
                    <input type="password" placeholder="•••" maxLength={4}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-rose-400 outline-none"
                      value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} />
                  </div>
                </div>
              </motion.div>
            )}
            {paymentMethod === 'upi' && (
              <motion.div key="upi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border-2 border-stone-100 p-6 space-y-5 shadow-sm">
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="font-bold text-stone-800 text-lg">Pay via UPI</h3>
                  <p className="text-stone-500 text-sm">Enter your UPI ID to pay instantly</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-2">UPI ID</label>
                  <input type="text" placeholder="yourname@upi"
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-rose-400 outline-none text-center font-mono text-lg"
                    value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['GPay', 'PhonePe', 'Paytm'].map(app => (
                    <button key={app} onClick={() => setUpiId(prev => prev.includes('@') ? prev : `${app.toLowerCase()}@ok`)}
                      className="border-2 border-stone-200 rounded-xl py-3 text-sm font-bold text-stone-600 hover:border-rose-400 hover:text-rose-500 transition-all">
                      {app}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {paymentMethod === 'netbanking' && (
              <motion.div key="netbanking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border-2 border-stone-100 p-6 space-y-5 shadow-sm">
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">🏦</div>
                  <h3 className="font-bold text-stone-800 text-lg">Net Banking</h3>
                  <p className="text-stone-500 text-sm">Select your bank to continue</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(b => (
                    <button key={b} onClick={() => setBank(b)}
                      className={`border-2 rounded-xl py-3 text-sm font-bold transition-all ${bank === b ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-stone-200 text-stone-600 hover:border-rose-300'}`}>
                      {b} Bank
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm lg:sticky top-24 space-y-6">
            <h3 className="font-serif font-bold text-stone-900 text-2xl">Order Summary</h3>
            <div className="flex gap-5 bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <img src={selectedVendor.img} alt={selectedVendor.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
              <div className="flex flex-col justify-center">
                <p className="font-bold text-stone-900 text-lg leading-tight">{selectedVendor.name}</p>
                <p className="text-stone-500 text-sm mt-1">{selectedVendor.category}</p>
                <p className="text-rose-500 text-sm font-medium mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedVendor.location}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-stone-600">
                <span>Base Price</span>
                <span className="font-medium text-stone-900">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Platform Booking Fee</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">FREE</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>GST (18%)</span>
                <span className="font-medium text-stone-900">Included</span>
              </div>
            </div>

            <div className="border-t-2 border-stone-100 pt-6 mt-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="block font-bold text-stone-900 text-xl">Total Amount</span>
                  <span className="text-stone-500 text-sm">Including all taxes</span>
                </div>
                <span className="font-bold text-rose-500 text-4xl">₹{amount.toLocaleString()}</span>
              </div>

              <motion.button onClick={handlePayment}
                className="w-full bg-linear-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 hover:shadow-rose-500/30 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <CreditCard className="w-6 h-6" />
                Pay ₹{amount.toLocaleString()}
              </motion.button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-stone-400 text-xs">
                <Shield className="w-3 h-3" />
                <p>By proceeding, you agree to our Terms & Conditions and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentsHistory = ({ user, setPage }: { user: UserData | null, setPage: (p: string) => void }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/payments/${user.id}`)
        .then(r => r.json().catch(() => []))
        .then(data => {
          const arr = Array.isArray(data) ? data : [];
          const localPayments = JSON.parse(localStorage.getItem('wedding_mock_payments') || '[]')
            .filter((p: any) => p.user_id === String(user.id));
          const all = [...arr, ...localPayments];
          const unique = Array.from(new Map(all.map(item => [item.payment_id, item])).values());
          setPayments(unique as Payment[]);
          setLoading(false);
        })
        .catch(() => {
          const localPayments = JSON.parse(localStorage.getItem('wedding_mock_payments') || '[]');
          setPayments(localPayments.filter((p: any) => p.user_id === String(user.id)));
          setLoading(false);
        });
    }
  }, [user]);

  const total = payments.reduce((s, p) => s + p.amount, 0);

  const methodIcon = (m: string) => m.includes('Card') ? '💳' : m === 'UPI' ? '📱' : '🏦';

  return (
    <motion.div className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-800">Payment History</h2>
          <p className="text-stone-500 text-sm mt-1">All your transactions in one place</p>
        </div>
        <button onClick={() => setPage('my-bookings')} className="text-rose-500 font-bold hover:underline text-sm">View Bookings</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Paid', value: `₹${total.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600' },
          { label: 'Transactions', value: payments.length.toString(), icon: <TrendingUp className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'All Successful', value: '100%', icon: <Shield className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold text-stone-800">{s.value}</p>
            <p className="text-stone-500 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <CreditCard className="w-10 h-10 text-rose-400" />
          </motion.div>
        </div>
      ) : payments.length === 0 ? (
        <motion.div className="bg-white p-16 rounded-2xl border-2 border-dashed border-stone-200 text-center"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <CreditCard className="w-14 h-14 text-stone-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-bold text-stone-600 mb-2">No Payments Yet</h3>
          <p className="text-stone-400 mb-6">Your payment history will appear here after you book a vendor.</p>
          <motion.button onClick={() => setPage('dashboard')}
            className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Browse Vendors
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {payments.map((p, i) => (
            <motion.div key={p.payment_id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, type: 'spring', damping: 20 }}
              whileHover={{ x: 5, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl">
                    {methodIcon(p.method)}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">{p.vendor_name}</p>
                    <p className="text-stone-500 text-sm">{p.method}</p>
                    <p className="text-stone-400 text-xs font-mono mt-0.5">TXN: {p.transaction_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-stone-800">₹{p.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 justify-end mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-600 text-xs font-bold uppercase">Success</span>
                  </div>
                  <p className="text-stone-400 text-xs mt-0.5 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const BookingConfirmation = ({ bookingId, setPage }: { bookingId: number | null, setPage: (p: string) => void }) => {

  return (
    <motion.div 
      className="max-w-md mx-auto mt-20 p-12 bg-white rounded-3xl shadow-2xl border border-stone-100 text-center"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
        className="bg-emerald-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: 1 }}>
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </motion.div>
      </motion.div>
      <motion.h2 
        className="text-3xl font-serif font-bold text-stone-800 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Booking Confirmed!
      </motion.h2>
      <motion.p 
        className="text-stone-500 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your request has been sent to the vendor. They will contact you shortly to discuss the details.
      </motion.p>
      
      <motion.div 
        className="bg-stone-50 p-6 rounded-2xl mb-8 border border-stone-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Booking ID</p>
        <motion.p className="text-2xl font-mono font-bold text-stone-800" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>#{bookingId}</motion.p>
      </motion.div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button 
          onClick={() => setPage('my-bookings')} 
          className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold shadow-lg"
          whileHover={{ scale: 1.05, backgroundColor: '#292524' }}
          whileTap={{ scale: 0.95 }}
        >
          View My Bookings
        </motion.button>
        <motion.button 
          onClick={() => setPage('dashboard')} 
          className="w-full bg-white text-stone-500 py-2 rounded-xl font-medium"
          whileHover={{ scale: 1.05, color: '#f43b5a' }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Vendors
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const BudgetTracker = ({ user, setPage, showMessage }: { user: UserData | null, setPage: (p: string) => void, showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({ category: 'Venue', description: '', amount: '' });
  
  // Load from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`budget_${user.id}`);
      if (saved) {
        const items = JSON.parse(saved);
        setBudgetItems(items);
      }
    }
  }, [user]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.amount) return;
    
    const newItem = {
      item_id: Date.now(),
      user_id: user.id,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      created_at: new Date().toISOString()
    };
    
    const updated = [...budgetItems, newItem];
    setBudgetItems(updated);
    localStorage.setItem(`budget_${user.id}`, JSON.stringify(updated));
    setFormData({ category: 'Venue', description: '', amount: '' });
    showMessage('success', 'Budget item added!');
  };

  const handleDeleteItem = (itemId: number) => {
    if (!user) return;
    const updated = budgetItems.filter(item => item.item_id !== itemId);
    setBudgetItems(updated);
    localStorage.setItem(`budget_${user.id}`, JSON.stringify(updated));
    showMessage('success', 'Budget item removed!');
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = budgetItems.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const categories = ['Venue', 'Catering', 'Photography', 'Decoration', 'Makeup', 'Entertainment', 'Other'];
  const categoryColors: any = {
    'Venue': '#f43b5a',
    'Catering': '#f97316',
    'Photography': '#3b82f6',
    'Decoration': '#ec4899',
    'Makeup': '#a855f7',
    'Entertainment': '#06b6d4',
    'Other': '#64748b'
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-12" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-serif font-bold text-stone-800">Wedding Budget</h2>
        <motion.button onClick={() => setPage('dashboard')} className="text-rose-500 font-bold hover:underline" whileHover={{ x: 5 }}>Back to Dashboard</motion.button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Budget Form */}
        <motion.div 
          className="md:col-span-1 bg-white rounded-2xl p-8 shadow-lg border border-stone-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-stone-800 mb-6">Add Expense</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Category</label>
              <select 
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Description</label>
              <input 
                type="text" 
                placeholder="e.g., Main venue"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Amount (₹)</label>
              <input 
                required 
                type="number" 
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <motion.button 
              type="submit" 
              className="w-full bg-rose-500 text-white py-2 rounded-lg font-bold hover:bg-rose-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Item
            </motion.button>
          </form>
        </motion.div>

        {/* Budget Summary & Chart */}
        <motion.div 
          className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-stone-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-stone-800 mb-6">Budget Summary</h3>
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs text-stone-400">Total Budget</p>
                <p className="text-4xl font-bold text-stone-800">₹{totalBudget.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">Items</p>
                <p className="text-2xl font-bold text-rose-500">{budgetItems.length}</p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([cat, amount]: any) => {
              const percentage = (amount / totalBudget) * 100;
              return (
                <motion.div 
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: categoryColors[cat] || '#64748b' }}
                      />
                      <span className="text-sm font-medium text-stone-700">{cat}</span>
                    </div>
                    <span className="text-sm font-bold text-stone-800">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      style={{ backgroundColor: categoryColors[cat] || '#64748b' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Budget Items List */}
      <motion.div 
        className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-stone-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-stone-800 mb-6">All Expenses</h3>
        {budgetItems.length === 0 ? (
          <p className="text-stone-500 text-center py-8">No budget items. Add one to get started!</p>
        ) : (
          <div className="space-y-3">
            {budgetItems.map((item) => (
              <motion.div 
                key={item.item_id}
                className="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: categoryColors[item.category] || '#64748b' }}
                  />
                  <div>
                    <p className="font-bold text-stone-800">{item.description || item.category}</p>
                    <p className="text-xs text-stone-400">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-stone-800 text-lg">₹{item.amount.toLocaleString()}</span>
                  <motion.button 
                    onClick={() => handleDeleteItem(item.item_id)}
                    className="text-stone-400 hover:text-rose-500 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PhotoGallery = ({ user, setPage, showMessage }: { user: UserData | null, setPage: (p: string) => void, showMessage: (type: 'success' | 'error', text: string) => void }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [formData, setFormData] = useState({ imageUrl: '', title: '', category: 'Inspiration' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Load from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`gallery_${user.id}`);
      if (saved) {
        const items = JSON.parse(saved);
        setPhotos(items);
      }
    }
  }, [user]);

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.imageUrl || !formData.title) return;
    
    const newPhoto = {
      photo_id: Date.now(),
      user_id: user.id,
      image_url: formData.imageUrl,
      title: formData.title,
      category: formData.category,
      created_at: new Date().toISOString()
    };
    
    const updated = [...photos, newPhoto];
    setPhotos(updated);
    localStorage.setItem(`gallery_${user.id}`, JSON.stringify(updated));
    setFormData({ imageUrl: '', title: '', category: 'Inspiration' });
    showMessage('success', 'Photo added to gallery!');
  };

  const handleDeletePhoto = (photoId: number) => {
    if (!user) return;
    const updated = photos.filter(photo => photo.photo_id !== photoId);
    setPhotos(updated);
    localStorage.setItem(`gallery_${user.id}`, JSON.stringify(updated));
    showMessage('success', 'Photo removed!');
  };

  const categories = ['All', 'Inspiration', 'Decorations', 'Dress', 'Venue', 'Makeup', 'Other'];
  const filteredPhotos = selectedCategory === 'All' ? photos : photos.filter(p => p.category === selectedCategory);

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-12" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-serif font-bold text-stone-800">Wedding Inspiration</h2>
        <motion.button onClick={() => setPage('dashboard')} className="text-rose-500 font-bold hover:underline" whileHover={{ x: 5 }}>Back to Dashboard</motion.button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Photo Form */}
        <motion.div 
          className="md:col-span-1 bg-white rounded-2xl p-8 shadow-lg border border-stone-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-stone-800 mb-6">Add Photo</h3>
          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Photo URL</label>
              <input 
                required
                type="url" 
                placeholder="https://..."
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g., Dream Venue"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Category</label>
              <select 
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <motion.button 
              type="submit" 
              className="w-full bg-rose-500 text-white py-2 rounded-lg font-bold hover:bg-rose-600 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Photo
            </motion.button>
          </form>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map(cat => (
              <motion.button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {filteredPhotos.length === 0 ? (
            <motion.div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-stone-200" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-stone-500">No photos in this category. Add one to get inspired!</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {filteredPhotos.map((photo) => (
                <motion.div 
                  key={photo.photo_id}
                  className="relative group rounded-lg overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={photo.image_url} 
                    alt={photo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex flex-col items-center justify-between p-4">
                    <div className="flex items-center justify-between w-full pt-0">
                      <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">{photo.category}</span>
                      <motion.button 
                        onClick={() => handleDeletePhoto(photo.photo_id)}
                        className="text-white bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </div>
                    <p className="text-white font-bold text-center opacity-0 group-hover:opacity-100 transition-all">{photo.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const MyBookings = ({ user, setPage }: { user: UserData | null, setPage: (p: string) => void }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  useEffect(() => {
    if (user) {
      fetch(`/api/bookings/${user.id}`)
        .then(res => res.json().catch(() => []))
        .then(data => {
          const arr = Array.isArray(data) ? data : [];
          const localBookings = JSON.parse(localStorage.getItem('wedding_mock_bookings') || '[]')
            .filter((b: any) => b.user_id === String(user.id));
          const all = [...arr, ...localBookings];
          const unique = Array.from(new Map(all.map(item => [item.booking_id, item])).values());
          setBookings(unique as Booking[]);
        })
        .catch(() => {
          const localBookings = JSON.parse(localStorage.getItem('wedding_mock_bookings') || '[]');
          setBookings(localBookings.filter((b: any) => b.user_id === String(user.id)));
        });
    }
  }, [user]);

  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setDeletingId(bookingId);
      
      // Update localStorage immediately
      let localBookings = JSON.parse(localStorage.getItem('wedding_mock_bookings') || '[]');
      localBookings = localBookings.filter((b: any) => b.booking_id !== bookingId);
      localStorage.setItem('wedding_mock_bookings', JSON.stringify(localBookings));
      
      try {
        await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      } catch (e) {}
      
      setBookings(bookings.filter(b => b.booking_id !== bookingId));
      setDeletingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <motion.div className="max-w-4xl mx-auto px-4 py-12" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-serif font-bold text-stone-800">My Bookings</h2>
        <motion.button onClick={() => setPage('dashboard')} className="text-rose-500 font-bold hover:underline" whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>Browse More Vendors</motion.button>
      </motion.div>
      
      {bookings.length === 0 ? (
        <motion.div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-stone-200" variants={itemVariants}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-stone-500">No bookings yet. Start planning your big day!</p>
        </motion.div>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants}>
          {bookings.map((b) => (
            <motion.div 
              key={b.booking_id} 
              className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex justify-between items-center"
              variants={itemVariants}
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', x: 5 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="flex items-center gap-4">
                <motion.div className="bg-rose-50 px-3 py-1 rounded text-rose-500 font-bold text-xs" whileHover={{ scale: 1.1 }}>ID #{b.booking_id}</motion.div>
                <div>
                  <h3 className="font-bold text-stone-800">{b.vendor_name}</h3>
                  <p className="text-stone-500 text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {b.booking_date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-stone-800 font-bold text-lg">₹{b.budget.toLocaleString()}</div>
                  <motion.div
                    className={`text-xs flex items-center gap-1 justify-end font-medium mt-0.5 ${b.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    {b.payment_status === 'paid'
                      ? <><CheckCircle className="h-3 w-3" /> Paid</>
                      : <><CreditCard className="h-3 w-3" /> Payment Pending</>}
                  </motion.div>
                </div>
                <motion.button
                  onClick={() => handleDeleteBooking(b.booking_id)}
                  disabled={deletingId === b.booking_id}
                  className="ml-4 px-4 py-2 bg-red-50 text-red-500 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {deletingId === b.booking_id ? 'Deleting...' : 'Cancel'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedVendorObject, setSelectedVendorObject] = useState<Vendor | null>(null);
  const [lastBookingId, setLastBookingId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`/api/favorites/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error('API failed');
          return res.json();
        })
        .then(setFavorites)
        .catch(() => {
          const localFavs = JSON.parse(localStorage.getItem('wedding_mock_favs') || '{}');
          setFavorites(localFavs[user.id] || []);
        });
      
      // Check for upcoming bookings (24h reminder)
      fetch(`/api/bookings/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error('API failed');
          return res.json();
        })
        .then(bookings => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          const upcoming = bookings.find((b: any) => b.booking_date === tomorrowStr);
          if (upcoming) {
            showMessage('success', `Reminder: You have a booking with ${upcoming.vendor_name} tomorrow!`);
          }
        })
        .catch(() => {
          const localBookings = JSON.parse(localStorage.getItem('wedding_mock_bookings') || '[]')
            .filter((b: any) => b.user_id === String(user.id));
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          const upcoming = localBookings.find((b: any) => b.booking_date === tomorrowStr);
          if (upcoming) showMessage('success', `Reminder: You have a booking with ${upcoming.vendor_name} tomorrow!`);
        });
    } else {
      setFavorites([]);
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wedding_user');
    setPage('home');
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const toggleFavorite = async (vendorId: number) => {
    if (!user) {
      setPage('login');
      return;
    }
    const isFav = favorites.includes(vendorId);
    const method = isFav ? 'DELETE' : 'POST';
    try {
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, vendorId })
      });
      if (!res.ok) throw new Error('API failed');
      setFavorites(prev => isFav ? prev.filter(id => id !== vendorId) : [...prev, vendorId]);
    } catch {
      // Vercel fallback
      const localFavs = JSON.parse(localStorage.getItem('wedding_mock_favs') || '{}');
      let userFavs = localFavs[user.id] || [];
      if (isFav) {
        userFavs = userFavs.filter((id: number) => id !== vendorId);
      } else {
        userFavs.push(vendorId);
      }
      localFavs[user.id] = userFavs;
      localStorage.setItem('wedding_mock_favs', JSON.stringify(localFavs));
      setFavorites(userFavs);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} setPage={setPage} />
      
      {/* Notifications */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
              message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </motion.div>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {page === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Home setPage={setPage} /></motion.div>}
          {page === 'about' && <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AboutUs setPage={setPage} /></motion.div>}
          {page === 'contact' && <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Contact showMessage={showMessage} /></motion.div>}
          {page === 'register' && <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><Register setPage={setPage} showMessage={showMessage} /></motion.div>}
          {page === 'login' && <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><Login setPage={setPage} setUser={setUser} showMessage={showMessage} /></motion.div>}
          {page === 'dashboard' && <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Dashboard user={user} setPage={setPage} setSelectedVendorObject={setSelectedVendorObject} favorites={favorites} toggleFavorite={toggleFavorite} /></motion.div>}
          {page === 'vendor-details' && <motion.div key="vendor-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><VendorDetails vendor={selectedVendorObject} setPage={setPage} user={user} favorites={favorites} toggleFavorite={toggleFavorite} /></motion.div>}
          {page === 'booking' && <motion.div key="booking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><BookingPage user={user} selectedVendor={selectedVendorObject} setPage={setPage} showMessage={showMessage} setLastBookingId={setLastBookingId} /></motion.div>}
          {page === 'payment' && <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><PaymentPage user={user} selectedVendor={selectedVendorObject} bookingId={lastBookingId} setPage={setPage} showMessage={showMessage} /></motion.div>}
          {page === 'confirmation' && <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}><BookingConfirmation bookingId={lastBookingId} setPage={setPage} /></motion.div>}
          {page === 'my-bookings' && <motion.div key="my-bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MyBookings user={user} setPage={setPage} /></motion.div>}
          {page === 'payments' && <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PaymentsHistory user={user} setPage={setPage} /></motion.div>}
          {page === 'budget' && <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BudgetTracker user={user} setPage={setPage} showMessage={showMessage} /></motion.div>}
          {page === 'gallery' && <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PhotoGallery user={user} setPage={setPage} showMessage={showMessage} /></motion.div>}
          {page === 'profile' && <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><Profile user={user} setUser={setUser} showMessage={showMessage} /></motion.div>}
          {page === 'favorites' && <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Favorites user={user} setPage={setPage} setSelectedVendorObject={setSelectedVendorObject} favorites={favorites} toggleFavorite={toggleFavorite} /></motion.div>}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-stone-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="font-serif font-bold text-2xl text-stone-800">EverAfter</span>
            </div>
            <div className="flex gap-8 text-stone-400 text-sm font-medium">
              <button onClick={() => setPage('home')} className="hover:text-rose-500 transition-colors">Home</button>
              <button onClick={() => setPage('dashboard')} className="hover:text-rose-500 transition-colors">Vendors</button>
              <button onClick={() => setPage('about')} className="hover:text-rose-500 transition-colors">About Us</button>
              <button onClick={() => setPage('contact')} className="hover:text-rose-500 transition-colors">Contact</button>
            </div>
            <p className="text-stone-400 text-xs">© 2026 EverAfter Wedding Planner. Academic Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
