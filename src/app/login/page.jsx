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
    <div className="flex justify-center items-center min-h-[85vh] px-4 my-8">
      <div className="w-full max-w-md p-6 bg-base-100 rounded-xl shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-center mb-6">Login to BookVerse</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="input input-bordered w-full"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="input input-bordered w-full"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Login
          </button>
        </form>

        <div className="divider">OR</div>
        
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full mb-4"
        >
          Login with Google
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/register" className="link link-primary font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;