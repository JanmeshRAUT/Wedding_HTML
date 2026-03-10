import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("wedding.db");
db.pragma("foreign_keys = ON");

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vendor_name TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    budget REAL NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    transaction_id TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER NOT NULL,
    vendor_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, vendor_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS budget_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS photo_gallery (
    photo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// --- Safe Migrations for existing databases ---
try { db.exec(`ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'pending'`); } catch {}
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'success',
      transaction_id TEXT NOT NULL,
      vendor_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
} catch {}

// --- Mock Vendor Data (Indian Context) ---
const MOCK_VENDORS = [
  {
    id: 1,
    name: "Vibrant Visions Photography",
    category: "Photographer",
    rating: 4.9,
    price: 75000,
    desc: "Capturing the essence of Indian weddings with cinematic brilliance.",
    img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=600",
    location: "Mumbai, Maharashtra",
    email: "contact@vibrantvisions.in",
    reviews: [
      {
        user: "Ananya S.",
        rating: 5,
        comment:
          "Absolutely amazing work! They captured every emotion perfectly.",
      },
      {
        user: "Rahul M.",
        rating: 4,
        comment: "Great quality, but a bit expensive.",
      },
    ],
  },
  {
    id: 2,
    name: "Spice Route Catering",
    category: "Caterer",
    rating: 4.8,
    price: 800,
    desc: "Authentic Indian flavors and international cuisines for your grand feast.",
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600",
    location: "Delhi, NCR",
    email: "info@spiceroute.com",
    reviews: [
      {
        user: "Priya K.",
        rating: 5,
        comment:
          "The food was the highlight of our wedding. Everyone loved it!",
      },
    ],
  },
  {
    id: 3,
    name: "Royal Mandap Decorators",
    category: "Decorator",
    rating: 4.7,
    price: 150000,
    desc: "Traditional and contemporary wedding decor that feels like royalty.",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600",
    location: "Bangalore, Karnataka",
    email: "royal@mandap.in",
    reviews: [
      {
        user: "Suresh V.",
        rating: 4,
        comment:
          "Beautiful setup, though they were slightly late for the setup.",
      },
    ],
  },
  {
    id: 4,
    name: "Shringar Bridal Studio",
    category: "Makeup Artist",
    rating: 4.9,
    price: 25000,
    desc: "Expert bridal makeup and styling for the perfect traditional look.",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600",
    location: "Chennai, Tamil Nadu",
    email: "shringar@beauty.com",
    reviews: [
      {
        user: "Meera R.",
        rating: 5,
        comment: "I felt like a queen! Thank you for the amazing makeover.",
      },
    ],
  },
  {
    id: 5,
    name: "Eternal Frames",
    category: "Photographer",
    rating: 4.6,
    price: 60000,
    desc: "Candid photography that captures every emotion of your special day.",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
    location: "Pune, Maharashtra",
    email: "eternal@frames.in",
    reviews: [],
  },
  {
    id: 6,
    name: "The Great Indian Kitchen",
    category: "Caterer",
    rating: 4.5,
    price: 1200,
    desc: "Exquisite multi-cuisine catering for weddings and large events.",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
    location: "Hyderabad, Telangana",
    email: "kitchen@greatindian.com",
    reviews: [],
  },
  {
    id: 7,
    name: "Utsav Event Planners",
    category: "Decorator",
    rating: 4.8,
    price: 250000,
    desc: "Bespoke wedding planning and grand venue decorations.",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
    location: "Jaipur, Rajasthan",
    email: "utsav@events.in",
    reviews: [],
  },
  {
    id: 8,
    name: "Apsara Beauty Lounge",
    category: "Makeup Artist",
    rating: 4.7,
    price: 35000,
    desc: "Luxury bridal makeovers and pre-wedding grooming services.",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    location: "Kolkata, West Bengal",
    email: "apsara@beauty.in",
    reviews: [],
  },

  // Additional Indian Vendors
  {
    id: 9,
    name: "Grand Ballroom Venues",
    category: "Venue",
    rating: 4.8,
    price: 200000,
    desc: "Luxurious banquet halls with traditional and modern architecture in heart of the city.",
    img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600",
    location: "Chennai, Tamil Nadu",
    email: "info@grandballroom.in",
    reviews: [
      {
        user: "Vikram K.",
        rating: 5,
        comment: "Perfect venue with excellent staff support!",
      },
    ],
  },

  {
    id: 10,
    name: "Sunshine Banquet Palace",
    category: "Venue",
    rating: 4.6,
    price: 150000,
    desc: "Traditional North Indian style banquet with world-class facilities and catering services.",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
    location: "Lucknow, Uttar Pradesh",
    email: "info@sunshinebanquet.in",
    reviews: [],
  },

  {
    id: 11,
    name: "Melody Music & DJ Co.",
    category: "DJ/Music",
    rating: 4.9,
    price: 45000,
    desc: "Professional DJs and live musicians for all Indian wedding occasions with classical to modern beats.",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
    location: "Delhi, NCR",
    email: "info@melodymusic.in",
    reviews: [
      {
        user: "Deepak S.",
        rating: 5,
        comment: "Incredible sound system and amazing playlist management!",
      },
    ],
  },

  {
    id: 12,
    name: "DJ Rajesh Productions",
    category: "DJ/Music",
    rating: 4.7,
    price: 35000,
    desc: "High-energy DJ services with modern light shows perfect for sangeet and reception.",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
    location: "Bangalore, Karnataka",
    email: "rajesh@djproductions.in",
    reviews: [],
  },

  {
    id: 13,
    name: "Maharani Bridal Couture",
    category: "Bridal Wear",
    rating: 4.9,
    price: 150000,
    desc: "Exquisite bridal lehengas, sarees and designer wedding attire with custom stitching.",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    location: "Ahmedabad, Gujarat",
    email: "info@maharanibridal.in",
    reviews: [
      {
        user: "Neha P.",
        rating: 5,
        comment:
          "The finest lehengas I have ever seen. Perfect fit and beautiful designs!",
      },
    ],
  },

  {
    id: 14,
    name: "Royal Designer Collection",
    category: "Bridal Wear",
    rating: 4.6,
    price: 120000,
    desc: "Traditional and contemporary bridal wear for all Indian weddings with premium fabrics.",
    img: "https://surattextilehub.com/images/product/2023/12/royal-designer-presents-vrindavan-vol-45-wedding-wear-banarsi-silk-unstitch-lehenga-collection-catalog-wholesaler-and-exporter-2023-12-26_19_09_04.jpg",
    location: "Mumbai, Maharashtra",
    email: "orders@royaldesigner.in",
    reviews: [],
  },

  {
    id: 15,
    name: "Jewels & Gems Palace",
    category: "Jewelry",
    rating: 4.8,
    price: 200000,
    desc: "Authentic gold and diamond jewelry with certified precious stones for Indian weddings.",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    location: "Jaipur, Rajasthan",
    email: "sales@jewelsgems.in",
    reviews: [
      {
        user: "Anjali M.",
        rating: 5,
        comment: "Outstanding jewelry designs and perfect craftsmanship!",
      },
    ],
  },

  {
    id: 16,
    name: "Golden Touch Jewelers",
    category: "Jewelry",
    rating: 4.7,
    price: 180000,
    desc: "Premium bridal jewelry sets including bangles, necklaces and traditional ornaments.",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    location: "Pune, Maharashtra",
    email: "orders@goldentouch.in",
    reviews: [],
  },

  {
    id: 17,
    name: "Floral Dreams Decorators",
    category: "Decorator",
    rating: 4.8,
    price: 120000,
    desc: "Fresh flower arrangements, traditional mandap decor and stage decorations.",
    img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600",
    location: "Hyderabad, Telangana",
    email: "info@floraldecorators.in",
    reviews: [],
  },

  {
    id: 18,
    name: "Shri Wedding Planners",
    category: "Event Planner",
    rating: 4.9,
    price: 100000,
    desc: "Complete wedding management from theme selection to day-of coordination with zero stress.",
    img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600",
    location: "Surat, Gujarat",
    email: "info@shriplanners.in",
    reviews: [
      {
        user: "Radhika V.",
        rating: 5,
        comment: "They managed everything flawlessly. Our wedding was a dream!",
      },
    ],
  },

  {
    id: 19,
    name: "Golden Occasions Events",
    category: "Event Planner",
    rating: 4.7,
    price: 85000,
    desc: "Expert wedding planning with attention to every detail and Indian traditions.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    location: "Indore, Madhya Pradesh",
    email: "contact@goldenoccasions.in",
    reviews: [],
  },

  {
    id: 20,
    name: "Spice & Taste Catering",
    category: "Caterer",
    rating: 4.9,
    price: 900,
    desc: "Authentic Rajasthani, Gujarati and Punjabi cuisines with modern presentation.",
    img: "https://tse3.mm.bing.net/th/id/OIP.438FMzr01jvFXfEtB_2i_wHaEf?pid=Api&h=220&P=0",
    location: "Udaipur, Rajasthan",
    email: "bookings@spicetaste.in",
    reviews: [
      {
        user: "Rajesh P.",
        rating: 5,
        comment:
          "Best Rajasthani food for our wedding. Guests loved every dish!",
      },
    ],
  },

  {
    id: 21,
    name: "North Star Photographer",
    category: "Photographer",
    rating: 4.8,
    price: 80000,
    desc: "Cinematic wedding videography with drone shots and same-day editing.",
    img: "https://i.ytimg.com/vi/VmKTHoHwwPI/maxresdefault.jpg",
    location: "New Delhi, Delhi",
    email: "studio@northstar.in",
    reviews: [],
  },

  {
    id: 22,
    name: "Classic Moments Photography",
    category: "Photographer",
    rating: 4.7,
    price: 70000,
    desc: "Traditional and candid wedding photography capturing every precious moment.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600",
    location: "Nashik, Maharashtra",
    email: "contact@classicmoments.in",
    reviews: [],
  },

  {
    id: 23,
    name: "Sindoor Makeup Studio",
    category: "Makeup Artist",
    rating: 4.9,
    price: 40000,
    desc: "Bridal and groom makeup with HD quality coverage and organic products.",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600",
    location: "Goa",
    email: "bookings@sindoor.in",
    reviews: [
      {
        user: "Priya R.",
        rating: 5,
        comment:
          "My makeup lasted the entire wedding without a single touch-up!",
      },
    ],
  },

  {
    id: 24,
    name: "Bridal Beauty Parlor",
    category: "Makeup Artist",
    rating: 4.6,
    price: 32000,
    desc: "Expert bridal and party makeup with skincare and pre-wedding treatments.",
    img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600",
    location: "Vadodara, Gujarat",
    email: "salon@bridalbeauty.in",
    reviews: [],
  },

  {
    id: 25,
    name: "Royal Feast Catering",
    category: "Caterer",
    rating: 4.8,
    price: 850,
    desc: "Multi-cuisine catering with South Indian specialties and continental options.",
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600",
    location: "Kochi, Kerala",
    email: "events@royalfeast.in",
    reviews: [],
  },

  {
    id: 26,
    name: "Invitations by Design",
    category: "Stationery",
    rating: 4.7,
    price: 15000,
    desc: "Custom wedding invitation cards with traditional Indian designs and personalization.",
    img: "https://blog.indianweddingcard.com/wp-content/uploads/2021/08/sikh-wedding.jpg",
    location: "Indore, Madhya Pradesh",
    email: "design@invitationsbydesign.in",
    reviews: [],
  },

  {
    id: 27,
    name: "Wedding Cards Premium",
    category: "Stationery",
    rating: 4.6,
    price: 12000,
    desc: "Eco-friendly wedding cards with intricate designs and gold foil printing.",
    img: "https://i.etsystatic.com/37821626/r/il/478a64/5848937267/il_fullxfull.5848937267_19dh.jpg",
    location: "Lucknow, Uttar Pradesh",
    email: "orders@cardspremium.in",
    reviews: [],
  },

  {
    id: 28,
    name: "Heritage Havelis Venue",
    category: "Venue",
    rating: 4.9,
    price: 250000,
    desc: "Stunning heritage havelis and forts perfect for destination Indian weddings.",
    img: "https://cdn0.weddingwire.in/vendor/8328/3_2/1280/jpg/hotel-royal-heritage-haveli-open-lawn-17_15_118328-161476173682051.jpeg",
    location: "Jaisalmer, Rajasthan",
    email: "bookings@heritagehavelis.in",
    reviews: [
      {
        user: "Vikas K.",
        rating: 5,
        comment: "A fairy tale wedding in the most beautiful venue!",
      },
    ],
  },

  {
    id: 29,
    name: "Symphony Orchestra Services",
    category: "DJ/Music",
    rating: 4.8,
    price: 120000,
    desc: "Live orchestra and classical musicians for engagement and mehendi ceremonies.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    location: "Mumbai, Maharashtra",
    email: "bookings@symphonyorchestra.in",
    reviews: [],
  },

  {
    id: 30,
    name: "Mehendi Palace",
    category: "Bridal Wear",
    rating: 4.8,
    price: 80000,
    desc: "Beautiful mehendi dresses and casual wedding wear with contemporary designs.",
    img: "https://media.weddingz.in/images/09766338888bd2a249329e07cfd105cf/Best-wedding-lehenga-shops-in-Dadar-for-Mumbai-brides15.jpg",
    location: "Surat, Gujarat",
    email: "style@mehendipalace.in",
    reviews: [],
  },
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Get Vendors
  app.get("/api/vendors", (req, res) => {
    res.json(MOCK_VENDORS);
  });

  // Registration
  app.post("/api/register", (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      );
      const result = stmt.run(name, email, password, phone);
      res.json({ success: true, userId: result.lastInsertRowid });
    } catch (error: any) {
      res
        .status(400)
        .json({
          success: false,
          message: error.message.includes("UNIQUE")
            ? "Email already exists"
            : error.message,
        });
    }
  });

  // Login
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db
      .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
      .get(email, password) as any;
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Update Profile
  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
      db.prepare(
        "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      ).run(name, email, phone, id);
      const user = db
        .prepare("SELECT id, name, email, phone FROM users WHERE id = ?")
        .get(id);
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Favorites
  app.get("/api/favorites/:userId", (req, res) => {
    const { userId } = req.params;
    const favs = db
      .prepare("SELECT vendor_id FROM favorites WHERE user_id = ?")
      .all(userId) as any[];
    res.json(favs.map((f) => f.vendor_id));
  });

  app.post("/api/favorites", (req, res) => {
    const { userId, vendorId } = req.body;
    try {
      db.prepare(
        "INSERT INTO favorites (user_id, vendor_id) VALUES (?, ?)",
      ).run(userId, vendorId);
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false });
    }
  });

  app.delete("/api/favorites", (req, res) => {
    const { userId, vendorId } = req.body;
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND vendor_id = ?").run(
      userId,
      vendorId,
    );
    res.json({ success: true });
  });

  // Booking
  app.post("/api/bookings", (req, res) => {
    const { userId, vendorName, date, budget } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO bookings (user_id, vendor_name, booking_date, budget) VALUES (?, ?, ?, ?)",
      );
      const result = stmt.run(userId, vendorName, date, budget);
      res.json({ success: true, bookingId: result.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get User Bookings
  app.get("/api/bookings/:userId", (req, res) => {
    const bookings = db
      .prepare("SELECT * FROM bookings WHERE user_id = ?")
      .all(req.params.userId);
    res.json(bookings);
  });

  // Delete Booking (cascade-delete associated payments first)
  app.delete("/api/bookings/:bookingId", (req, res) => {
    const { bookingId } = req.params;
    try {
      const deleteAll = db.transaction(() => {
        // Delete linked payments first to avoid FK constraint violation
        db.prepare("DELETE FROM payments WHERE booking_id = ?").run(bookingId);
        db.prepare("DELETE FROM bookings WHERE booking_id = ?").run(bookingId);
      });
      deleteAll();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Budget Tracker
  app.post("/api/budget", (req, res) => {
    const { userId, category, description, amount } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO budget_items (user_id, category, description, amount, created_at) VALUES (?, ?, ?, ?, ?)",
      );
      const result = stmt.run(
        userId,
        category,
        description,
        amount,
        new Date().toISOString(),
      );
      res.json({ success: true, itemId: result.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/budget/:userId", (req, res) => {
    const items = db
      .prepare(
        "SELECT * FROM budget_items WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(req.params.userId);
    res.json(items);
  });

  app.delete("/api/budget/:itemId", (req, res) => {
    const { itemId } = req.params;
    try {
      db.prepare("DELETE FROM budget_items WHERE item_id = ?").run(itemId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Photo Gallery
  app.post("/api/gallery", (req, res) => {
    const { userId, imageUrl, title, category } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO photo_gallery (user_id, image_url, title, category, created_at) VALUES (?, ?, ?, ?, ?)",
      );
      const result = stmt.run(
        userId,
        imageUrl,
        title,
        category || "Inspiration",
        new Date().toISOString(),
      );
      res.json({ success: true, photoId: result.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/gallery/:userId", (req, res) => {
    const photos = db
      .prepare(
        "SELECT * FROM photo_gallery WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(req.params.userId);
    res.json(photos);
  });

  app.delete("/api/gallery/:photoId", (req, res) => {
    const { photoId } = req.params;
    try {
      db.prepare("DELETE FROM photo_gallery WHERE photo_id = ?").run(photoId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Contact Form
  app.post("/api/contact", (req, res) => {
    // For now, just return success
    res.json({ success: true });
  });

  // --- Payment Routes ---

  // Process a Payment
  app.post("/api/payments", (req, res) => {
    const { bookingId, userId, amount, method, vendorName } = req.body;
    try {
      // Generate a mock transaction ID
      const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const now = new Date().toISOString();

      // Insert payment record
      const stmt = db.prepare(
        "INSERT INTO payments (booking_id, user_id, amount, method, status, transaction_id, vendor_name, created_at) VALUES (?, ?, ?, ?, 'success', ?, ?, ?)",
      );
      const result = stmt.run(
        bookingId,
        userId,
        amount,
        method,
        transactionId,
        vendorName,
        now,
      );

      // Update booking payment_status
      db.prepare(
        "UPDATE bookings SET payment_status = 'paid' WHERE booking_id = ?",
      ).run(bookingId);

      res.json({
        success: true,
        paymentId: result.lastInsertRowid,
        transactionId,
        amount,
        method,
        timestamp: now,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all payments for a user
  app.get("/api/payments/:userId", (req, res) => {
    const { userId } = req.params;
    const payments = db
      .prepare(
        "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(userId);
    res.json(payments);
  });

  // Get payment for a specific booking
  app.get("/api/payments/booking/:bookingId", (req, res) => {
    const { bookingId } = req.params;
    const payment = db
      .prepare(
        "SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1",
      )
      .get(bookingId);
    res.json(payment || null);
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (req, res) => res.sendFile(path.resolve("dist/index.html")));
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
