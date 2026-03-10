import { VercelRequest, VercelResponse } from '@vercel/node';

// Hardcoded demo data for Vercel
const DEMO_DATA = {
  users: [
    { id: 1, name: 'Demo User', email: 'demo@example.com', password: 'demo123', phone: '9999999999' }
  ],
  bookings: [],
  favorites: {},
  budgetItems: [],
  photoGallery: []
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extract user ID and booking ID from URL path like /api/bookings/123/456
  const pathArray = (req.url || '').split('/').filter(p => p);
  const userId = pathArray[2]; // /api/bookings/{userId}
  const bookingId = pathArray[3]; // /api/bookings/{userId}/{bookingId}
  
  if (req.method === 'POST') {
    // Add booking
    const { vendorName, date, budget } = req.body;
    const booking = {
      booking_id: DEMO_DATA.bookings.length + 1,
      user_id: userId,
      vendor_name: vendorName,
      booking_date: date,
      budget: budget,
      payment_status: 'pending' // Added for Vercel
    };
    DEMO_DATA.bookings.push(booking);
    res.status(200).json({ success: true, bookingId: booking.booking_id });
  } else if (req.method === 'GET') {
    // Get bookings for user
    const userBookings = DEMO_DATA.bookings.filter(b => b.user_id === userId);
    res.status(200).json(userBookings);
  } else if (req.method === 'DELETE') {
    // Delete booking
    const index = DEMO_DATA.bookings.findIndex(b => b.booking_id === parseInt(bookingId as string));
    if (index > -1) {
      DEMO_DATA.bookings.splice(index, 1);
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Booking not found' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
