import authMiddleware from '../utils/middleware/jwtAuth';
import dbMiddleware from '../utils/middleware/dbMiddleware';
import validateMovieInput from '../validation/movieValidation';
import { sendSuccess, sendError } from '../lib/response';
import {
  getMovieByIdForUser,
  updateMovieForUser,
  deleteMovieForUser,
} from '../services/movieService';

export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } },
};

async function handleGet(req, res) {
  try {
    const movie = await getMovieByIdForUser(req.query.id, req.user.userId);
    return sendSuccess(res, 200, 'Movie retrieved successfully', movie);
  } catch (err) {
    const status = err.statusCode || 500;
    if (status === 500) console.error('Get movie error:', err);
    return sendError(res, status, err.message);
  }
}

async function handleUpdate(req, res) {
  try {
    const { error, value } = validateMovieInput({
      title: req.body.title,
      publishingYear: parseInt(req.body.publishingYear),
      poster: req.body.poster,
    });
    if (error) return sendError(res, 400, error.details[0].message);

    const movie = await updateMovieForUser(req.query.id, req.user.userId, value);
    return sendSuccess(res, 200, 'Movie updated successfully', movie);
  } catch (err) {
    const status = err.statusCode || 500;
    if (status === 500) console.error('Update movie error:', err);
    return sendError(res, status, err.message);
  }
}

async function handleDelete(req, res) {
  try {
    await deleteMovieForUser(req.query.id, req.user.userId);
    return sendSuccess(res, 200, 'Movie deleted successfully');
  } catch (err) {
    const status = err.statusCode || 500;
    if (status === 500) console.error('Delete movie error:', err);
    return sendError(res, status, err.message);
  }
}

const applyAuth = (handler) => authMiddleware(handler);

const handlers = {
  GET: applyAuth(handleGet),
  PATCH: applyAuth(handleUpdate),
  DELETE: applyAuth(handleDelete),
};

export default async function handler(req, res) {
  await dbMiddleware(req, res, async () => {
    const selected = handlers[req.method.toUpperCase()];
    selected ? selected(req, res) : sendError(res, 405, 'Method Not Allowed');
  });
}
