import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory storage fallback.
// Using global to persist across hot reloads or same-lambda executions in Vercel.
const globalAny = global as any;
if (!globalAny.weddingUsers) {
  globalAny.weddingUsers = {
    'demo@example.com': { id: 1, name: 'Demo User', email: 'demo@example.com', password: 'demo123', phone: '9999999999' }
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;
    const user = globalAny.weddingUsers[email];
    if (user && user.password === password) {
      res.status(200).json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
