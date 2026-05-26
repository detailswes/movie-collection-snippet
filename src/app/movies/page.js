"use client";
import MoviesList from "components/MoviesList";
import EmptyList from "components/EmptyList";
import { useGetMoviesQuery } from "services/movies";
import SkeletonGrid from "common/SkeletonCard";
import Error from "common/error";
import { useState } from "react";

const PAGE_SIZE = 8;

const Movies = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: moviesData,
    isFetching,
    error,
  } = useGetMoviesQuery({ page: currentPage, pageSize: PAGE_SIZE });

  const movies = moviesData?.data || [];
  const totalCount = moviesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (error) return <Error />;

  if (isFetching) return <div className="container px-6"><SkeletonGrid count={PAGE_SIZE} /></div>;

  return (
    <div className="container px-6">
      {movies.length === 0 ? (
        <EmptyList />
      ) : (
        <MoviesList
          movies={movies}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Movies;
