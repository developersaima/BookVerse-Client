"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from 'next/link';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signUp, signInGoogle } from "@/lib/auth-client";
import { FaEye, FaEyeSlash, FaCamera, FaSpinner, FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { LuBookOpenText } from "react-icons/lu";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      role: "reader",
      password: "",
      image: "",
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");

      const url = data.data.url;
      setImageUrl(url);
      setValue("image", url);
      toast.success("Profile photo uploaded!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    await signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        image: formData.image || "",
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
    <div className="min-h-screen bg-base-200 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center gap-2 mb-3">
            <LuBookOpenText className="text-emerald-500 text-4xl" />
            <span className="text-3xl font-black tracking-tight text-base-content">
              Book<span className="text-emerald-500">Verse</span>
            </span>
          </div> */}
          <h2 className="text-2xl font-bold text-base-content">Create Account</h2>
          <p className="text-sm text-base-content/60 mt-1">Join  Book<span className="text-emerald-500 font-medium">Verse</span> community of readers and writers</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex justify-center">
            <div className="avatar placeholder relative group">
              <div className="w-24 h-24 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-base-200">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const parent = e.target.parentElement;
                      parent.innerHTML = `<span class="text-3xl font-bold text-white">${"U"}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">U</span>
                )}
              </div>
              <label 
                htmlFor="profileUpload" 
                className="absolute bottom-0 right-0 btn btn-circle btn-success btn-sm text-white cursor-pointer border-2 border-base-100"
              >
                {imageUploading ? <FaSpinner className="animate-spin" /> : <FaCamera />}
              </label>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={imageUploading}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content flex items-center gap-2">
                <FaUser className="text-emerald-500" /> Full Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              {...register("fullName", {
                required: "Full name is required",
              })}
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full bg-base-200 text-base-content border-base-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all duration-200"
            />
            {errors.fullName && (
              <p className="text-error text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content flex items-center gap-2">
                <FaEnvelope className="text-emerald-500" /> Email <span className="text-error">*</span>
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
              className="input input-bordered w-full bg-base-200 text-base-content border-base-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all duration-200"
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content flex items-center gap-2">
                <FaUserTag className="text-emerald-500" /> Register As
              </span>
            </label>
            <select
              {...register("role")}
              className="select select-bordered w-full bg-base-200 text-base-content border-base-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all duration-200"
            >
              <option value="reader"> Reader</option>
              <option value="writer"> Writer</option>
            </select>
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
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message: "Password must contain at least one letter and one number",
                  },
                })}
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
              <p className="text-error text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-success text-white w-full border-none shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
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
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline ml-1 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;