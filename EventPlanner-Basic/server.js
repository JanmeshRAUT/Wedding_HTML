import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Data Storage (In-memory for demo)
let users = [];
let bookings = [];
let vendors = [];
let payments = [];
let gallery = [];
let budget = { total: 0, spent: 0 };
let favorites = [];

// Mock Vendors - Enhanced with detailed information
const mockVendors = [
  {
    id: 1,
    name: 'Vibrant Visions Photography',
    category: 'Photography',
    rating: 4.9,
    price: 75000,
    desc: 'Capturing the essence of weddings with cinematic brilliance. Professional photography and videography services.',
    img: '📸',
    location: 'Mumbai, Maharashtra',
    email: 'contact@vibrantvisions.in',
    reviews: [
      { user: 'Ananya S.', rating: 5, comment: 'Absolutely amazing work! They captured every emotion perfectly.' },
      { user: 'Rahul M.', rating: 4, comment: 'Great quality and professional team.' }
    ]
  },
  {
    id: 2,
    name: 'Spice Route Catering',
    category: 'Catering',
    rating: 4.8,
    price: 800,
    desc: 'Authentic Indian flavors and international cuisines for your grand feast. Expert culinary team with 15+ years experience.',
    img: '🍽️',
    location: 'Delhi, NCR',
    email: 'info@spiceroute.com',
    reviews: [
      { user: 'Priya K.', rating: 5, comment: 'The food was the highlight of our wedding. Everyone loved it!' }
    ]
  },
  {
    id: 3,
    name: 'Royal Mandap Decorators',
    category: 'Decoration',
    rating: 4.7,
    price: 150000,
    desc: 'Traditional and contemporary wedding decor that feels like royalty. Custom designs for your vision.',
    img: '🎨',
    location: 'Bangalore, Karnataka',
    email: 'royal@mandap.in',
    reviews: [
      { user: 'Suresh V.', rating: 4, comment: 'Beautiful setup, they transform venues amazingly.' }
    ]
  },
  {
    id: 4,
    name: 'Shringar Bridal Studio',
    category: 'Makeup Artist',
    rating: 4.9,
    price: 25000,
    desc: 'Expert bridal makeup and styling for the perfect traditional and modern looks. Specializing in Indian and fusion weddings.',
    img: '💄',
    location: 'Chennai, Tamil Nadu',
    email: 'shringar@beauty.com',
    reviews: [
      { user: 'Meera R.', rating: 5, comment: 'I felt like a queen! Thank you for the amazing makeover.' }
    ]
  },
  {
    id: 5,
    name: 'Eternal Frames Studio',
    category: 'Photography',
    rating: 4.6,
    price: 60000,
    desc: 'Candid photography that captures every emotion of your special day. Beautiful, timeless moments preserved.',
    img: '📷',
    location: 'Pune, Maharashtra',
    email: 'eternal@frames.in',
    reviews: []
  },
  {
    id: 6,
    name: 'The Grand Ballroom',
    category: 'Venue',
    rating: 4.9,
    price: 500000,
    desc: 'Luxury wedding venue with stunning architecture and world-class facilities. Capacity for 200-1000 guests.',
    img: '🏰',
    location: 'Hyderabad, Telangana',
    email: 'events@grandbballroom.com',
    reviews: [
      { user: 'Vikram P.', rating: 5, comment: 'Perfect venue, amazing staff, unforgettable experience!' }
    ]
  },
  {
    id: 7,
    name: 'Harmony Music & DJ',
    category: 'Music & DJ',
    rating: 4.8,
    price: 50000,
    desc: 'Professional DJ and live music services for weddings. High-energy entertainment with state-of-the-art sound systems.',
    img: '🎵',
    location: 'Indore, Madhya Pradesh',
    email: 'harmony@musicdj.com',
    reviews: [
      { user: 'Rohan D.', rating: 5, comment: 'Best DJ ever! Kept the dance floor packed all night!' }
    ]
  }
];

// ===== AUTH ROUTES =====
app.post('/api/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const user = {
    id: Date.now(),
    name,
    email,
    phone,
    password,
    createdAt: new Date()
  };

  users.push(user);
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

// ===== USER ROUTES =====
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  Object.assign(user, req.body);
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

// ===== VENDORS ROUTES =====
app.get('/api/vendors', (req, res) => {
  res.json(mockVendors);
});

app.get('/api/vendors/:id', (req, res) => {
  const vendor = mockVendors.find(v => v.id == req.params.id);
  if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
  res.json(vendor);
});

// ===== BOOKINGS ROUTES =====
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const booking = {
    booking_id: Date.now(),
    ...req.body,
    created_at: new Date()
  };
  bookings.push(booking);
  res.json(booking);
});

app.delete('/api/bookings/:id', (req, res) => {
  bookings = bookings.filter(b => b.booking_id != req.params.id);
  res.json({ success: true });
});

// ===== PAYMENTS ROUTES =====
app.get('/api/payments', (req, res) => {
  res.json(payments);
});

app.post('/api/payments', (req, res) => {
  const payment = {
    payment_id: Date.now(),
    ...req.body,
    created_at: new Date()
  };
  payments.push(payment);
  res.json(payment);
});

app.delete('/api/payments/:id', (req, res) => {
  payments = payments.filter(p => p.payment_id != req.params.id);
  res.json({ success: true });
});

// ===== BUDGET ROUTES =====
app.get('/api/budget', (req, res) => {
  res.json(budget);
});

app.post('/api/budget', (req, res) => {
  budget = req.body;
  res.json(budget);
});

// ===== GALLERY ROUTES =====
app.get('/api/gallery', (req, res) => {
  res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
  const item = {
    id: Date.now(),
    ...req.body,
    created_at: new Date()
  };
  gallery.push(item);
  res.json(item);
});

app.delete('/api/gallery/:id', (req, res) => {
  gallery = gallery.filter(g => g.id != req.params.id);
  res.json({ success: true });
});

// ===== FAVORITES ROUTES =====
app.get('/api/favorites', (req, res) => {
  res.json(favorites);
});

app.post('/api/favorites/:vendorId', (req, res) => {
  if (!favorites.includes(req.params.vendorId)) {
    favorites.push(req.params.vendorId);
  }
  res.json({ success: true, favorites });
});

app.delete('/api/favorites/:vendorId', (req, res) => {
  favorites = favorites.filter(id => id != req.params.vendorId);
  res.json({ success: true, favorites });
});

// ===== CONTACT ROUTE =====
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Contact from ${name} (${email}): ${message}`);
  res.json({ success: true, message: 'Message received' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Server running at http://localhost:${PORT}`);
  console.log('📱 EverAfter Wedding Planner Application Started');
});
