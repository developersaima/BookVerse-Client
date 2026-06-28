"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn, signInGoogle } from '@/lib/auth-client';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    await signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          toast.success("Login successful!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login failed!");
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    await signInGoogle();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-green-500 dark:bg-base-100 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-green-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-green-900">Login</h2>
        <p className="text-center text-green-700 mb-8">Welcome back to BookVerse</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-green-800">Email Address</span>
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="example@mail.com"
              className="input input-bordered w-full bg-green-50/50 border-green-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all duration-200"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-green-800">Password</span>
            </label>
            <div className="relative flex items-center">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full bg-green-50/50 border-green-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none pr-12 transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-4 text-green-600 hover:text-green-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message }</p>}
          </div>

          <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white w-full border-none shadow-md mt-6 font-semibold transition-all duration-200">
            Login
          </button>
        </form>

        <div className="divider text-green-400 my-6 text-sm font-medium">OR</div>
        
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full border-green-300 text-green-800 hover:bg-green-600 hover:text-white hover:border-green-600 flex items-center justify-center gap-3 font-semibold transition-all duration-200"
        >
          <FcGoogle size={22} className="group-hover:scale-110 transition-transform duration-200" />
          Login with Google
        </button>

        <p className="text-sm text-center mt-6 text-green-800">
          Don't have an account?{" "}
          <Link href="/register" className="text-green-600 font-bold hover:text-green-700 hover:underline ml-1">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;