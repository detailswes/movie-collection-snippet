"use client";
import { useState } from "react";
import PlusIcon from "assets/images/icons/plus.svg";
import LogoutIcon from "assets/images/icons/logout.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteMovieMutation } from "services/movies";
import ConfirmDialog from "common/ConfirmDialog";
import { toast } from "react-toastify";
import Image from "next/image";
import { useLogout } from "hooks/useLogout";
import EditIcon from "common/icons/EditIcon";
import TrashIcon from "common/icons/TrashIcon";

const MoviesList = ({ movies, currentPage, totalPages, onPageChange }) => {
  const router = useRouter();
  const handleLogout = useLogout();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [movieIdToDelete, setMovieIdToDelete] = useState(null);
  const [deleteMovie] = useDeleteMovieMutation();

  const handleEdit = (id) => {
    router.push(`movies/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteMovie(movieIdToDelete);
      if (response?.data?.success) {
        toast.success(response.data.message);
        // Go to the previous page when the last item on a page is deleted
        if (currentPage > 1 && movies.length === 1) {
          onPageChange(currentPage - 1);
        }
      } else {
        toast.error(response?.error?.data?.message || "Failed to delete movie.");
      }
    } catch (error) {
      toast.error("Failed to delete movie.");
    }
  };

  const confirmDelete = (id) => {
    setMovieIdToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmDialogOpen(false);
    await handleDelete();
  };

  const handleCancel = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <div className="py-32">
        <div className="flex justify-between items-center mb-32">
          <div className="flex items-center">
            <h2>My movies</h2>
            <Link href="/movies/add">
              <PlusIcon className="ms-3 mt-2" />
            </Link>
          </div>
          <button onClick={handleLogout} className="flex items-center">
            <span className="text-base hidden sm:block font-bold text-white">
              Logout
            </span>
            <LogoutIcon className="ms-3" />
          </button>
        </div>

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="group bg-card p-2 rounded-xl hover:bg-[#1E414E] transition-all"
            >
              <div className="flex items-center justify-center">
                <Image
                  className="object-cover object-center w-full min-h-[300px] max-h-[300px] xl:min-h-[400px] lg:max-h-[400px] rounded-xl h-full"
                  src={movie.poster}
                  width={400}
                  height={400}
                  alt={movie.title}
                  unoptimized={movie.poster?.startsWith("data:")}
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="mt-4 mb-2">
                  <h6 className="mb-2 mx-2 break-all">{movie.title}</h6>
                  <p className="mx-2">{movie.publishingYear}</p>
                </div>
                <div className="flex justify-end items-end space-x-4 mb-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(movie._id)}
                    aria-label={`Edit ${movie.title}`}
                    className="invisible group-hover:visible hover:bg-primary-900 py-2.5 mb-2"
                  >
                    <EditIcon className="h-8 w-8 text-green-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(movie._id)}
                    aria-label={`Delete ${movie.title}`}
                    className="invisible group-hover:visible hover:bg-primary-900 py-2.5 mb-3 mr-1"
                  >
                    <TrashIcon className="w-6 h-6 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-32 flex-wrap">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className={`pagination-control ${currentPage === 1 ? "disabled" : ""}`}
            disabled={currentPage === 1}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`pagination-count ${
                currentPage === index + 1 ? "bg-primary" : "bg-card"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            className={`pagination-control ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            disabled={currentPage === totalPages}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>

      {isConfirmDialogOpen && (
        <ConfirmDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message="Are you sure you want to delete this movie?"
        />
      )}
    </>
  );
};

export default MoviesList;
