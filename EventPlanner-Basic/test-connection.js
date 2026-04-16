import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.DATABASE_URL || process.env.mongodb;

console.log('Testing MongoDB Connection...');
console.log('URI:', MONGODB_URI ? 'Found' : 'NOT FOUND');

if (!MONGODB_URI) {
  console.error('❌ DATABASE_URL is missing in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
  family: 4
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return mongoose.connection.collection('users').countDocuments();
  })
  .then((count) => {
    console.log(`✅ User count: ${count}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });
