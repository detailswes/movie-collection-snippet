import { v2 as cloudinary } from 'cloudinary';
import authMiddleware from './utils/middleware/jwtAuth';
import { sendError } from './lib/response';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } },
};

async function handleUpload(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  const { data } = req.body;
  if (!data) {
    return sendError(res, 400, 'No image data provided');
  }

  try {
    const result = await cloudinary.uploader.upload(data, {
      folder: 'movies',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    });

    return res.status(200).json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return sendError(res, 500, 'Image upload failed');
  }
}

export default function handler(req, res) {
  return authMiddleware(handleUpload)(req, res);
}
