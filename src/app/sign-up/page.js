"use client";
import { useState } from "react";
import InputBox from "common/Inputbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRegisterMutation } from "services/auth";
import Link from "next/link";

const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const FormSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    )
    .required("Please enter a password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [register] = useRegisterMutation();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: FormSchema,
      onSubmit: async ({ email, password }) => {
        setLoading(true);
        try {
          const response = await register({ email, password });
          if (response?.data?.success) {
            toast.success("Account created! Please sign in.");
            router.push("/sign-in");
          } else {
            const errMsg =
              response?.error?.data?.message ||
              "Registration failed. Please try again.";
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
        <h1 className="mb-10 text-center">Create account</h1>
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
            {errors.email && touched.email && (
              <p className="form-error text-error mt-2 ms-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
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
            {errors.password && touched.password && (
              <p className="form-error text-error mt-2 ms-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="mb-6 pb-5">
            <InputBox
              className={`inputbox ${
                errors.confirmPassword && touched.confirmPassword
                  ? "border border-error"
                  : ""
              }`}
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="form-error text-error mt-2 ms-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            className="button"
            type="submit"
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-white text-sm mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
