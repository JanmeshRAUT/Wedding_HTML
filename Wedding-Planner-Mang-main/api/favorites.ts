import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { userId } = req.query;

  if (req.method === 'GET') {
    // Get favorites
    res.status(200).json([]);
  } else if (req.method === 'POST') {
    // Add favorite
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    // Remove favorite
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ success: false });
  }
}
