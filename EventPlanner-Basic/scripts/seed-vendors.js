import mongoose from 'mongoose';
import 'dotenv/config';
import { mockVendors } from '../data/mock-vendors.js';

const MONGODB_URI = process.env.DATABASE_URL || process.env.mongodb;
const SHOULD_RESET = process.argv.includes('--reset');

if (!MONGODB_URI) {
  console.error('DATABASE_URL (or mongodb) is missing in .env');
  process.exit(1);
}

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

async function upsertVendors() {
  let inserted = 0;
  let updated = 0;

  for (const vendor of mockVendors) {
    const result = await Vendor.updateOne(
      { id: vendor.id },
      {
        $set: {
          name: vendor.name,
          category: vendor.category,
          rating: vendor.rating,
          price: vendor.price,
          desc: vendor.desc,
          img: vendor.img,
          location: vendor.location,
          email: vendor.email,
          reviews: vendor.reviews
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  return { inserted, updated };
}

async function main() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 15000
  });

  if (SHOULD_RESET) {
    await Vendor.deleteMany({ id: { $in: mockVendors.map((v) => v.id) } });
  }

  const { inserted, updated } = await upsertVendors();

  console.log(`Vendor seed complete. Inserted: ${inserted}, Updated: ${updated}`);
}

main()
  .catch((error) => {
    console.error('Vendor seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
