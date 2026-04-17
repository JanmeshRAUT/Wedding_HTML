import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { mockVendors } from './data/mock-vendors.js';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10]
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.DATABASE_URL || process.env.mongodb;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ALLOWED_ROLES = ['admin', 'user', 'vendor'];

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Login/Register tokens will fail until configured.');
}

let mongoConnectPromise;

function connectToMongoDB() {
  if (!MONGODB_URI) {
    console.warn('MongoDB URI not found. Set DATABASE_URL in .env to enable database connection.');
    return Promise.resolve();
  }

  if (!mongoConnectPromise) {
    mongoConnectPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      family: 4
    });
  }

  return mongoConnectPromise;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Metrics middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(durationInMilliseconds / 1000);
  });
  next();
});

function getDurationInMilliseconds(start) {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ALLOWED_ROLES, default: 'user' }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    img: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    reviews: { type: [reviewSchema], default: [] }
  },
  { timestamps: true }
);

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

function normalizeRole(role) {
  const rawRole = (role || 'user').toLowerCase().trim();
  if (rawRole === 'vender') {
    return 'vendor';
  }
  return rawRole;
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

function generateToken(user) {
  if (!JWT_SECRET) {
    return null;
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.headers['x-access-token'] || null;
}

function requireAdmin(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(503).json({ success: false, message: 'JWT auth is not configured. Set JWT_SECRET first.' });
  }

  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing auth token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.auth = payload;
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

function requireAuth(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(503).json({ success: false, message: 'JWT auth is not configured. Set JWT_SECRET first.' });
  }

  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing auth token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload;
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Data Storage (In-memory for demo)
let bookings = [];
let payments = [];
let gallery = [];
let budget = { total: 0, spent: 0 };
let favorites = [];

// ===== AUTH ROUTES =====
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = normalizeRole(role);

    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Use admin, user, or vendor.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: normalizedRole
    });

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      message: token ? 'Registration successful' : 'Registration successful. Set JWT_SECRET to enable auth tokens.'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      message: token ? 'Login successful' : 'Login successful. Set JWT_SECRET to enable auth tokens.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
});

// ===== USER ROUTES =====
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updates = { ...req.body };

    if (typeof updates.email === 'string') {
      updates.email = updates.email.toLowerCase().trim();
    }

    if (updates.role) {
      updates.role = normalizeRole(updates.role);
      if (!ALLOWED_ROLES.includes(updates.role)) {
        return res.status(400).json({ success: false, message: 'Invalid role. Use admin, user, or vendor.' });
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update user' });
  }
});

// ===== ADMIN ROUTES =====
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const role = req.query.role ? normalizeRole(String(req.query.role)) : null;
    const search = String(req.query.search || '').trim();

    const filter = {};
    if (role) {
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role filter. Use admin, user, or vendor.' });
      }
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    const payloadUsers = users.map((user) => ({
      ...sanitizeUser(user),
      createdAt: user.createdAt
    }));

    res.json({
      success: true,
      users: payloadUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
  }
});

// ===== VENDORS ROUTES =====
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ id: 1 }).lean();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch vendors' });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ id: Number(req.params.id) }).lean();
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch vendor' });
  }
});

// ===== VENDOR DASHBOARD ROUTES =====
app.get('/api/vendor/profile', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'vendor') {
      return res.status(403).json({ success: false, message: 'Only vendors can access this' });
    }

    const vendor = await Vendor.findOne({ email: req.auth.email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    res.json({
      success: true,
      vendor: {
        id: vendor._id.toString(),
        name: vendor.name,
        category: vendor.category,
        price: vendor.price,
        desc: vendor.desc,
        location: vendor.location,
        email: vendor.email,
        rating: vendor.rating,
        reviews: vendor.reviews || [],
        createdAt: vendor.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch vendor profile' });
  }
});

app.put('/api/vendor/profile', requireAuth, async (req, res) => {
  try {
    if (req.auth.role !== 'vendor') {
      return res.status(403).json({ success: false, message: 'Only vendors can access this' });
    }

    const { name, category, price, desc, location } = req.body;

    const vendor = await Vendor.findOneAndUpdate(
      { email: req.auth.email },
      {
        name: name,
        category: category,
        price: price,
        desc: desc,
        location: location,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      vendor: {
        id: vendor._id.toString(),
        name: vendor.name,
        category: vendor.category,
        price: vendor.price,
        desc: vendor.desc,
        location: vendor.location,
        email: vendor.email,
        rating: vendor.rating,
        reviews: vendor.reviews || [],
        createdAt: vendor.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update vendor profile' });
  }
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

// Start server only when running locally.
if (!process.env.VERCEL) {
  connectToMongoDB()
    .then(() => {
      if (MONGODB_URI) {
        console.log('MongoDB connected');
      }
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    });
} else {
  connectToMongoDB().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
}

// Export app for Vercel serverless runtime.
export default app;
