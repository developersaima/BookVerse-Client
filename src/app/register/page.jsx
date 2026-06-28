"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signUp, signInGoogle } from "@/lib/auth-client";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "reader",
    },
  });

  const onSubmit = async (formData) => {
    await signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        image: "",
        role: formData.role,
      },
      {
        onSuccess: () => {
          toast.success("Registration successful!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Registration failed!");
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    await signInGoogle();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-green-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-green-900">
          Join BookVerse
        </h2>

        <p className="text-center text-green-700 mb-8">
          Create your account to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-green-800">
                Full Name
              </span>
            </label>

            <input
              {...register("fullName", {
                required: "Full name is required",
              })}
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full bg-green-50 border-green-200 focus:border-green-600 outline-none"
            />

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-green-800">
                Email
              </span>
            </label>

            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="example@mail.com"
              className="input input-bordered w-full bg-green-50 border-green-200 focus:border-green-600 outline-none"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-green-800">
                Register As
              </span>
            </label>

            <select
              {...register("role")}
              className="select select-bordered w-full bg-green-50 border-green-200 focus:border-green-600 outline-none"
            >
              <option value="reader">Reader</option>
              <option value="writer">Writer</option>
            </select>
          </div>

          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-semibold text-green-800">
                Password
              </span>
            </label>

            <div className="relative flex items-center">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message:
                      "Password must contain at least one letter and one number",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full bg-green-50 border-green-200 focus:border-green-600 outline-none pr-12"
              />

              <button
                type="button"
                className="absolute right-4 text-green-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn bg-green-600 hover:bg-green-700 text-white w-full mt-4 border-none"
          >
            Register
          </button>
        </form>

        <div className="divider text-green-400 my-6">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full border-green-300 text-green-800 hover:bg-green-600 hover:text-white"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;