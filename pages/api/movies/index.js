import dbMiddleware from '../utils/middleware/dbMiddleware';
import authMiddleware from '../utils/middleware/jwtAuth';
import validateMovieInput from '../validation/movieValidation';
import { sendSuccess, sendError } from '../lib/response';
import { createMovie, listMovies } from '../services/movieService';

export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } },
};

async function handleCreate(req, res) {
  try {
    const { error, value } = validateMovieInput({
      title: req.body.title,
      publishingYear: parseInt(req.body.publishingYear),
      poster: req.body.poster,
    });
    if (error) return sendError(res, 400, error.details[0].message);

    const movie = await createMovie({ ...value, userId: req.user.userId });
    return sendSuccess(res, 201, 'Movie created successfully', movie);
  } catch (err) {
    console.error('Create movie error:', err);
    return sendError(res, 500, 'Internal Server Error');
  }
}

async function handleList(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 10));

    const { movies, totalCount } = await listMovies({
      userId: req.user.userId,
      page,
      pageSize,
    });

    return res.status(200).json({ success: true, data: movies, totalCount });
  } catch (err) {
    console.error('List movies error:', err);
    return sendError(res, 500, 'Internal Server Error');
  }
}

const applyAuth = (handler) => authMiddleware(handler);

const handlers = {
  POST: applyAuth(handleCreate),
  GET: applyAuth(handleList),
};

export default async function handler(req, res) {
  await dbMiddleware(req, res, async () => {
    const selected = handlers[req.method.toUpperCase()];
    selected ? selected(req, res) : sendError(res, 405, 'Method Not Allowed');
  });
}
