"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn, signInGoogle } from '@/lib/auth-client';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { LuBookOpenText } from "react-icons/lu";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  // Admin credentials for testing
  const fillAdminCredentials = () => {
    document.querySelector('input[name="email"]').value = "admin@bookverse.com";
    document.querySelector('input[name="password"]').value = "Admin001";
    // Trigger change events
    const event = new Event('input', { bubbles: true });
    document.querySelector('input[name="email"]').dispatchEvent(event);
    document.querySelector('input[name="password"]').dispatchEvent(event);
    toast.success("Admin credentials filled!");
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center gap-2 mb-3">
            <LuBookOpenText className="text-emerald-500 text-4xl" />
            <span className="text-3xl font-black tracking-tight text-base-content">
              Book<span className="text-emerald-500">Verse</span>
            </span>
          </div> */}
          <h2 className="text-2xl font-bold text-base-content">Welcome Back</h2>
          <p className="text-sm text-base-content/60 mt-1">Sign in to  Book<span className="text-emerald-500 font-medium">Verse</span> continue your reading journey</p>
        </div>

        <div className=" border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUserShield className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Admin Demo:</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">admin@bookverse.com</span>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="btn btn-xs btn-success text-white"
          >
            Fill
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content flex items-center gap-2">
                <FaEnvelope className="text-emerald-500" /> Email Address <span className="text-error">*</span>
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
              name="email"
              placeholder="example@mail.com"
              className="input input-bordered w-full bg-base-200 text-base-content border-base-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all duration-200"
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content flex items-center gap-2">
                <FaLock className="text-emerald-500" /> Password <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full bg-base-200 text-base-content border-base-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none pr-12 transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-4 text-base-content/40 hover:text-emerald-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

        

          <button
            type="submit"
            className="btn btn-success text-white w-full border-none shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider text-base-content/40 my-6 text-sm font-medium">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full border-base-300 text-base-content hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center justify-center gap-3 font-medium transition-all duration-200"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6 text-base-content/70">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline ml-1 transition-colors">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;