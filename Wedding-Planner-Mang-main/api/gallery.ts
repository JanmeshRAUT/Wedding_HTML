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

  if (req.method === 'GET') {
    // Get gallery photos
    res.status(200).json([]);
  } else if (req.method === 'POST') {
    // Add photo
    const { imageUrl, title, category } = req.body;
    res.status(200).json({ success: true, photoId: Math.random() });
  } else if (req.method === 'DELETE') {
    // Delete photo
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ success: false });
  }
}
