import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  publishingYear: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Compound index: speeds up per-user movie queries and default sort by newest
movieSchema.index({ user_id: 1, _id: -1 });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;
