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

  if (req.method === 'PUT') {
    const pathArray = (req.url || '').split('/').filter(p => p);
    const id = pathArray.includes('users') ? pathArray[pathArray.indexOf('users') + 1] : req.query.id;
    
    const { name, email, phone } = req.body;
    
    // Find user by id
    const usersList = Object.values(globalAny.weddingUsers) as any[];
    let user = usersList.find((u: any) => u.id === parseInt(id as string, 10));
    
    if (user) {
      user.name = name;
      user.email = email;
      user.phone = phone;
      // Re-assign in case email changed
      delete globalAny.weddingUsers[Object.keys(globalAny.weddingUsers).find(k => globalAny.weddingUsers[k].id === user.id)!];
      globalAny.weddingUsers[email] = user;
      res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
