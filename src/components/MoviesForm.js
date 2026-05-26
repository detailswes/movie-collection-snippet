"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadIcon from "assets/images/icons/upload.svg";
import InputBox from "common/Inputbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAddMovieMutation, useUpdateMovieMutation } from "services/movies";
import Link from "next/link";
import Image from "next/image";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const CURRENT_YEAR = new Date().getFullYear();

const FormSchema = Yup.object({
  title: Yup.string().required("Please enter the title"),
  publishingYear: Yup.number()
    .typeError("Publishing year must be a number")
    .required("Please enter the publishing year")
    .integer("Publishing year must be an integer")
    .min(1888, "Publishing year must be 1888 or later")
    .max(CURRENT_YEAR + 5, "Publishing year is too far in the future"),
  poster: Yup.mixed().required("Please upload a poster"),
});

/**
 * Shared field block used in both the mobile-only and desktop-only layout slots.
 * Accepts formik bag props to avoid any duplication of bindings.
 */
const FormFields = ({ values, errors, touched, handleChange, handleBlur }) => (
  <>
    <div className="mb-6">
      <InputBox
        className={`inputbox ${
          errors.title && touched.title ? "border border-error" : ""
        }`}
        type="text"
        name="title"
        placeholder="Title"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.title}
      />
      {errors.title && touched.title && (
        <p className="form-error text-error mt-2 ms-1">{errors.title}</p>
      )}
    </div>

    <div className="w-full mb-6">
      <InputBox
        className={`inputbox ${
          errors.publishingYear && touched.publishingYear
            ? "border border-error"
            : ""
        }`}
        type="text"
        name="publishingYear"
        placeholder="Publishing year"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.publishingYear}
      />
      {errors.publishingYear && touched.publishingYear && (
        <p className="form-error text-error mt-2 ms-1">
          {errors.publishingYear}
        </p>
      )}
    </div>
  </>
);

const MoviesForm = ({ movie, editPage = false, id }) => {
  const { data: movieData } = movie || {};
  const [addMovie] = useAddMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    title: "",
    publishingYear: "",
    poster: null,
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      const response = editPage
        ? await updateMovie({ id, values })
        : await addMovie(values);

      if (response?.data?.success === true) {
        toast.success(
          editPage ? "Movie updated successfully!" : "Movie added successfully!"
        );
        router.push("/movies");
        if (!editPage) action.resetForm();
      } else {
        toast.error(response?.error?.data?.message || "An error occurred.");
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (movieData) {
      setValues({
        title: movieData.title,
        publishingYear: movieData.publishingYear.toString(),
        poster: movieData.poster,
      });
    }
  }, [movieData, setValues]);

  const [uploading, setUploading] = useState(false);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      try {
        setUploading(true);
        const base64 = await toBase64(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64 }),
          credentials: "same-origin",
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          toast.error(json.message || "Image upload failed.");
          return;
        }
        setFieldValue("poster", json.url);
      } catch {
        toast.error("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [setFieldValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    onDrop,
  });

  const fieldProps = { values, errors, touched, handleChange, handleBlur };

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="w-full flex flex-wrap items-start">
        {/* Upload zone */}
        <div className="flex items-center justify-center w-full md:max-w-[473px] lg:mr-[127px] order-2 md:order-none">
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-full min-h-[380px] lg:min-h-[504px] border-2 border-white border-dashed rounded-xl cursor-pointer bg-input"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="mb-2" />
              <div className="mb-2 px-4">
                {uploading ? (
                  <span className="text-white">Uploading...</span>
                ) : values.poster ? (
                  <Image
                    src={values.poster}
                    alt="Selected poster"
                    className="w-full h-auto mb-2"
                    width={400}
                    height={400}
                    unoptimized={values.poster?.startsWith("data:")}
                  />
                ) : (
                  <span className="text-white">Drop an image here</span>
                )}
              </div>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              name="poster"
              {...getInputProps()}
            />
            {errors.poster && touched.poster && (
              <p className="form-error text-error">{errors.poster}</p>
            )}
          </div>
        </div>

        {/* Fields — mobile slot (visible on small screens only) */}
        <div className="w-full mt-4 lg:mt-0 md:max-w-[362px] block md:hidden order-1 md:order-none">
          <FormFields {...fieldProps} />
        </div>

        {/* Fields — desktop slot + action buttons */}
        <div className="w-full mt-4 lg:mt-0 md:max-w-[362px] order-3 md:order-none">
          <div className="hidden md:block">
            <FormFields {...fieldProps} />
          </div>
          <div className="mt-10 md:mt-16 flex gap-4 items-center">
            <Link href="/movies" className="light-button">
              Cancel
            </Link>
            <button
              type="submit"
              className="button"
              disabled={loading || uploading}
              style={{ cursor: loading || uploading ? "not-allowed" : "pointer" }}
            >
              {uploading ? "Uploading..." : loading ? "Processing..." : editPage ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MoviesForm;
