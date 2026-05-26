import Movie from '../models/movies';
import mongoose from 'mongoose';

/**
 * Parse a movie ID string into a Mongoose ObjectId.
 * Returns null if the ID is invalid.
 */
export function parseObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
    ? mongoose.Types.ObjectId.createFromHexString(id)
    : null;
}

/**
 * Fetch a paginated list of movies belonging to a user.
 */
export async function listMovies({ userId, page, pageSize }) {
  const skip = (page - 1) * pageSize;

  const [movies, totalCount] = await Promise.all([
    Movie.find({ user_id: userId }).sort({ _id: -1 }).skip(skip).limit(pageSize),
    Movie.countDocuments({ user_id: userId }),
  ]);

  return { movies, totalCount };
}

/**
 * Create a new movie for the given user.
 */
export async function createMovie({ title, publishingYear, poster, userId }) {
  const movie = new Movie({ title, publishingYear, poster, user_id: userId });
  await movie.save();
  return movie;
}

/**
 * Find a single movie that belongs to the given user.
 * @throws {Error} with statusCode 404 if not found.
 */
export async function getMovieByIdForUser(movieId, userId) {
  const objectId = parseObjectId(movieId);
  if (!objectId) {
    const err = new Error('Invalid movie ID');
    err.statusCode = 400;
    throw err;
  }

  const movie = await Movie.findOne({ _id: objectId, user_id: userId });
  if (!movie) {
    const err = new Error("Movie not found or you don't have permission to view it");
    err.statusCode = 404;
    throw err;
  }

  return movie;
}

/**
 * Update a movie that belongs to the given user.
 * @throws {Error} with statusCode 404 if not found.
 */
export async function updateMovieForUser(movieId, userId, { title, publishingYear, poster }) {
  const movie = await getMovieByIdForUser(movieId, userId);

  movie.title = title;
  movie.publishingYear = publishingYear;
  movie.poster = poster;
  await movie.save();

  return movie;
}

/**
 * Delete a movie that belongs to the given user.
 * @throws {Error} with statusCode 404 if not found.
 */
export async function deleteMovieForUser(movieId, userId) {
  const movie = await getMovieByIdForUser(movieId, userId);
  await movie.deleteOne();
}
