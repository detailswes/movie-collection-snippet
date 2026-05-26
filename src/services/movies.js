import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    // The auth token is sent automatically as an HttpOnly cookie on every
    // same-origin request — no manual Authorization header needed.
    credentials: 'same-origin',
  }),
  tagTypes: ['movies', 'singleMovie'],
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: ({ page = 1, pageSize = 10 }) =>
        `movies?page=${page}&pageSize=${pageSize}`,
      providesTags: ['movies'],
    }),

    getMovieById: builder.query({
      query: (id) => `movies/${id}`,
      providesTags: ['singleMovie'],
    }),

    addMovie: builder.mutation({
      query: (values) => ({
        url: 'movies',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['movies'],
    }),

    updateMovie: builder.mutation({
      query: ({ id, values }) => ({
        url: `movies/${id}`,
        method: 'PATCH',
        body: values,
      }),
      invalidatesTags: ['movies', 'singleMovie'],
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['movies'],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApi;
