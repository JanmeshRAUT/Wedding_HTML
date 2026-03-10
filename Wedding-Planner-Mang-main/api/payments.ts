import { VercelRequest, VercelResponse } from '@vercel/node';

// Hardcoded demo payments for Vercel
const DEMO_DATA = {
  payments: [] as any[]
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

  // Extract variables from URL path like /api/payments/123 or /api/payments/booking/456
  const pathArray = (req.url || '').split('/').filter(p => p);
  
  if (req.method === 'POST') {
    // Process new payment
    const { bookingId, userId, amount, method, vendorName } = req.body;
    
    // Simulate transaction delay
    const payment = {
      payment_id: DEMO_DATA.payments.length + 1,
      booking_id: bookingId,
      user_id: userId,
      amount: amount,
      method: method,
      status: 'success',
      transaction_id: 'TXN' + Math.random().toString().slice(2, 10),
      vendor_name: vendorName,
      created_at: new Date().toISOString()
    };
    
    DEMO_DATA.payments.push(payment);
    
    res.status(200).json({ success: true, payment });
  } else if (req.method === 'GET') {
    // Check if it's requesting by booking ID or User ID
    const isBooking = pathArray[1] === 'booking'; // /api/payments/booking/{bookingId}
    
    if (isBooking) {
      const bookingId = pathArray[2];
      const payment = DEMO_DATA.payments.find(p => p.booking_id === parseInt(bookingId as string, 10));
      if (payment) {
        res.status(200).json(payment);
      } else {
        res.status(404).json({ message: 'Payment not found for this booking' });
      }
    } else {
      // /api/payments/{userId}
      const userId = pathArray[1];
      const userPayments = DEMO_DATA.payments.filter(p => p.user_id === userId);
      res.status(200).json(userPayments);
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
