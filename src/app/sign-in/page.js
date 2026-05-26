"use client";
import { useState } from "react";
import InputBox from "common/Inputbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLoginMutation } from "services/auth";
import { moviesApi } from "services/movies";
import { useDispatch } from "react-redux";
import Link from "next/link";

const initialValues = {
  email: "",
  password: "",
};

const FormSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [login] = useLoginMutation();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: FormSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const response = await login(values);
          if (response?.data?.success) {
            // Clear any stale cached movie data from a previous session
            dispatch(moviesApi.util.resetApiState());
            router.push("/movies");
          } else {
            const errMsg =
              response?.error?.data?.message ||
              "An error occurred. Please try again.";
            toast.error(errMsg);
          }
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <div className="h-screen flex justify-center items-center mx-3.5">
      <div className="w-[300px]">
        <h1 className="mb-10 text-center">Sign in</h1>
        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-6">
            <InputBox
              className={`inputbox ${
                errors.email && touched.email ? "border border-error" : ""
              }`}
              type="text"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>
              {errors.email && touched.email ? (
                <p className="form-error text-error mt-2 ms-1">
                  {errors.email}
                </p>
              ) : null}
            </span>
          </div>

          <div className="mb-6 pb-5">
            <InputBox
              className={`inputbox ${
                errors.password && touched.password ? "border border-error" : ""
              }`}
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span>
              {errors.password && touched.password ? (
                <p className="form-error text-error mt-2 ms-1">
                  {errors.password}
                </p>
              ) : null}
            </span>
          </div>

          <button
            className="button"
            type="submit"
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <p className="text-center text-white text-sm mt-6">
          {"Don't have an account? "}
          <Link href="/sign-up" className="text-primary underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
