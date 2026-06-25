"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signUp, signInGoogle } from '@/lib/auth-client';

const RegisterPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    await signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
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
    <div className="flex justify-center items-center min-h-[85vh] px-4 my-8">
      <div className="w-full max-w-md p-6 bg-base-100 rounded-xl shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-center mb-6">Join BookVerse</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="form-control">
            <label className="label"><span className="label-text">Full Name</span></label>
            <input 
              {...register("fullName", { required: "Full name is required" })}
              type="text" 
              className="input input-bordered w-full" 
            />
            {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input 
              {...register("email", { 
                required: "Email is required", 
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } 
              })}
              type="email" 
              className="input input-bordered w-full" 
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <input 
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Min 6 characters" },
                validate: {
                  hasUpper: (v) => /[A-Z]/.test(v) || "Must have an Uppercase letter",
                  hasLower: (v) => /[a-z]/.test(v) || "Must have a Lowercase letter",
                }
              })}
              type="password" 
              className="input input-bordered w-full" 
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Selection */}
          <div className="form-control">
            <label className="label"><span className="label-text">I am a...</span></label>
            <select {...register("role", { required: true })} className="select select-bordered w-full">
              <option value="reader">Reader</option>
              <option value="writer">Writer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">Register</button>
        </form>

        <div className="divider">OR</div>
        
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-outline w-full mb-4"
        >
          Continue with Google
        </button>
        
        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="link link-primary font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;