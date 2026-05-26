import  {connectToDatabase}  from "../../database/db";

export default async function dbMiddleware(req, res, next) {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
