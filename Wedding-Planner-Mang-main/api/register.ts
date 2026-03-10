import { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { name, email, password, phone } = req.body;
    if (globalAny.weddingUsers[email]) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const newId = Object.keys(globalAny.weddingUsers).length + 1;
    globalAny.weddingUsers[email] = { id: newId, name, email, password, phone };
    res.status(200).json({ success: true, userId: newId });
  } else {
    res.status(405).json({ success: false });
  }
}
