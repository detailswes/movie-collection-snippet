import Joi from 'joi';

const CURRENT_YEAR = new Date().getFullYear();

const movieValidationSchema = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  publishingYear: Joi.number()
    .integer()
    .min(1888)
    .max(CURRENT_YEAR + 5)
    .required()
    .messages({
      'number.min': 'Publishing year must be 1888 or later',
      'number.max': `Publishing year cannot exceed ${CURRENT_YEAR + 5}`,
      'any.required': 'Publishing year is required',
    }),
  poster: Joi.string().required().messages({
    'any.required': 'Poster image is required',
  }),
});

export default function validateMovieInput(data) {
  return movieValidationSchema.validate(data);
}
