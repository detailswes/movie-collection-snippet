"use client";
import { use } from "react";
import MoviesForm from "components/MoviesForm";
import { useGetMovieByIdQuery } from "services/movies";
import Error from "common/error";

/**
 * Skeleton placeholder that matches the MoviesForm layout.
 * Shown instead of a blank form while the movie data is fetching.
 */
const FormSkeleton = () => (
  <div className="w-full flex flex-wrap items-start animate-pulse gap-8">
    {/* Poster placeholder */}
    <div className="w-full md:max-w-[473px] min-h-[380px] lg:min-h-[504px] rounded-xl bg-input" />
    {/* Fields placeholder */}
    <div className="flex-1 space-y-6 mt-4 lg:mt-0">
      <div className="h-[45px] rounded-[10px] bg-input" />
      <div className="h-[45px] rounded-[10px] bg-input" />
    </div>
  </div>
);

const EditMovie = ({ params }) => {
  const { id } = use(params);
  const { data: movie, isLoading, error } = useGetMovieByIdQuery(id);

  if (error) return <Error />;

  return (
    <div className="container px-6">
      <div className="py-32">
        <div className="w-full xl:w-10/12 m-auto">
          <h1 className="mb-16 md:mb-32 text-[32px] lg:text-5xl">Edit</h1>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <MoviesForm movie={movie} editPage id={id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMovie;
