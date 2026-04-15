import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { mockVendors } from '../data/mock-vendors.js';

const MONGODB_URI = process.env.DATABASE_URL || process.env.mongodb;
const ALLOWED_ROLES = ['admin', 'user', 'vendor'];
const SHOULD_RESET = process.argv.includes('--reset');
const USERS_ONLY_MODE = process.argv.includes('--users-only');
const RESET_USERS_ONLY = process.argv.includes('--reset-users-only');

const countArg = process.argv.find((arg) => arg.startsWith('--count='));
const REQUESTED_COUNT = countArg ? Number(countArg.split('=')[1]) : null;

if (!MONGODB_URI) {
  console.error('DATABASE_URL (or mongodb) is missing in .env');
  process.exit(1);
}

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

const DEFAULT_VENDOR_PASSWORD = 'Vendor@123';

const mockUsers = [
  {
    name: 'System Admin',
    email: 'admin@eventplanner.com',
    phone: '9000000001',
    password: 'Admin@123',
    role: 'admin'
  },
  {
    name: 'Aarav Sharma',
    email: 'user@eventplanner.com',
    phone: '9000000002',
    password: 'User@123',
    role: 'user'
  },
  {
    name: 'Royal Decor Vendor',
    email: 'vendor@eventplanner.com',
    phone: '9000000003',
    password: 'Vendor@123',
    role: 'vendor'
  },
  {
    name: 'Nisha Kulkarni',
    email: 'nisha.kulkarni@eventplanner.com',
    phone: '9000000004',
    password: 'User@123',
    role: 'user'
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@eventplanner.com',
    phone: '9000000005',
    password: 'User@123',
    role: 'user'
  }
];

const mockRegularUsers = [
  { name: 'Aditya Rao', email: 'aditya.rao+seed01@eventplanner.com', phone: '9010000001', password: 'User@123', role: 'user' },
  { name: 'Priya Nair', email: 'priya.nair+seed02@eventplanner.com', phone: '9010000002', password: 'User@123', role: 'user' },
  { name: 'Kunal Verma', email: 'kunal.verma+seed03@eventplanner.com', phone: '9010000003', password: 'User@123', role: 'user' },
  { name: 'Sneha Iyer', email: 'sneha.iyer+seed04@eventplanner.com', phone: '9010000004', password: 'User@123', role: 'user' },
  { name: 'Rahul Khanna', email: 'rahul.khanna+seed05@eventplanner.com', phone: '9010000005', password: 'User@123', role: 'user' },
  { name: 'Meera Patel', email: 'meera.patel+seed06@eventplanner.com', phone: '9010000006', password: 'User@123', role: 'user' },
  { name: 'Vikram Joshi', email: 'vikram.joshi+seed07@eventplanner.com', phone: '9010000007', password: 'User@123', role: 'user' },
  { name: 'Isha Kapoor', email: 'isha.kapoor+seed08@eventplanner.com', phone: '9010000008', password: 'User@123', role: 'user' },
  { name: 'Arjun Singh', email: 'arjun.singh+seed09@eventplanner.com', phone: '9010000009', password: 'User@123', role: 'user' },
  { name: 'Pooja Mishra', email: 'pooja.mishra+seed10@eventplanner.com', phone: '9010000010', password: 'User@123', role: 'user' },
  { name: 'Nitin Desai', email: 'nitin.desai+seed11@eventplanner.com', phone: '9010000011', password: 'User@123', role: 'user' },
  { name: 'Ritu Malhotra', email: 'ritu.malhotra+seed12@eventplanner.com', phone: '9010000012', password: 'User@123', role: 'user' },
  { name: 'Devansh Gupta', email: 'devansh.gupta+seed13@eventplanner.com', phone: '9010000013', password: 'User@123', role: 'user' },
  { name: 'Aisha Khan', email: 'aisha.khan+seed14@eventplanner.com', phone: '9010000014', password: 'User@123', role: 'user' },
  { name: 'Sarthak Jain', email: 'sarthak.jain+seed15@eventplanner.com', phone: '9010000015', password: 'User@123', role: 'user' },
  { name: 'Neha Bansal', email: 'neha.bansal+seed16@eventplanner.com', phone: '9010000016', password: 'User@123', role: 'user' },
  { name: 'Harshita Roy', email: 'harshita.roy+seed17@eventplanner.com', phone: '9010000017', password: 'User@123', role: 'user' },
  { name: 'Aman Chawla', email: 'aman.chawla+seed18@eventplanner.com', phone: '9010000018', password: 'User@123', role: 'user' },
  { name: 'Tanvi Shah', email: 'tanvi.shah+seed19@eventplanner.com', phone: '9010000019', password: 'User@123', role: 'user' },
  { name: 'Yash Patil', email: 'yash.patil+seed20@eventplanner.com', phone: '9010000020', password: 'User@123', role: 'user' }
];

function buildRegularUsers() {
  const count = Number.isFinite(REQUESTED_COUNT) && REQUESTED_COUNT > 0
    ? Math.min(REQUESTED_COUNT, mockRegularUsers.length)
    : mockRegularUsers.length;

  return mockRegularUsers.slice(0, count);
}

function buildVendorUsers() {
  return mockVendors
    .filter((vendor) => vendor.email)
    .map((vendor) => ({
      name: vendor.name,
      email: String(vendor.email).toLowerCase().trim(),
      phone: '',
      password: DEFAULT_VENDOR_PASSWORD,
      role: 'vendor'
    }));
}

function buildSeedUsers() {
  if (USERS_ONLY_MODE) {
    return buildRegularUsers();
  }

  const usersByEmail = new Map();

  [...mockUsers, ...buildVendorUsers()].forEach((entry) => {
    usersByEmail.set(entry.email, entry);
  });

  return [...usersByEmail.values()];
}

async function upsertMockUsers(seedUsers) {
  let inserted = 0;
  let updated = 0;

  for (const entry of seedUsers) {
    const hashedPassword = await bcrypt.hash(entry.password, 10);

    const result = await User.updateOne(
      { email: entry.email },
      {
        $set: {
          name: entry.name,
          phone: entry.phone,
          password: hashedPassword,
          role: entry.role
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

  const seedUsers = buildSeedUsers();

  if (SHOULD_RESET) {
    await User.deleteMany({ email: { $in: seedUsers.map((u) => u.email) } });
  }

  if (RESET_USERS_ONLY) {
    await User.deleteMany({ email: { $in: buildRegularUsers().map((u) => u.email) } });
  }

  const { inserted, updated } = await upsertMockUsers(seedUsers);

  const vendorUsersCount = seedUsers.filter((user) => user.role === 'vendor').length;

  console.log(`Seed complete. Inserted: ${inserted}, Updated: ${updated}`);
  console.log(`Total seeded users: ${seedUsers.length} (vendors: ${vendorUsersCount})`);
  console.log('Default vendor password for seeded vendor accounts: Vendor@123');

  if (USERS_ONLY_MODE) {
    console.log('Mode: users-only (no admin/vendor entries added).');
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
