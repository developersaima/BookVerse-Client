"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn, signInGoogle } from '@/lib/auth-client';

const LoginPage = () => {
  const router = useRouter();
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
    // এখানে min-h-screen এবং bg-green-50 পুরো স্ক্রিন জুড়ে হালকা সবুজ ব্যাকগ্রাউন্ড নিশ্চিত করবে
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4 py-12">
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
              className="input input-bordered w-full bg-green-50 border-green-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-green-800">Password</span>
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full bg-green-50 border-green-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white w-full border-none shadow-md">
            Login
          </button>
        </form>

        <div className="divider text-green-400 my-6">OR</div>
        
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full border-green-300 text-green-800 hover:bg-green-600 hover:text-white hover:border-green-600"
        >
          Login with Google
        </button>

        <p className="text-sm text-center mt-6 text-green-800">
          Don't have an account?{" "}
          <Link href="/register" className="text-green-700 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;