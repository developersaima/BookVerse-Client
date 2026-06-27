"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { uploadImageToImgBB } from '@/lib/upload';
import { useSession } from '@/lib/auth-client';

const AddEbookPage = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Uploading...");
    
    try {
      const imageUrl = await uploadImageToImgBB(data.coverImage[0]);

      const ebookData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        genre: data.genre,
        coverImage: imageUrl,
        writerEmail: session?.user?.email,
        writerName: session?.user?.name,
        status: 'published',
        isSold: false
      };

      const res = await fetch('/api/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ebookData),
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Ebook added successfully!");
        reset();
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-green-100">
      <h2 className="text-2xl font-bold text-green-900 mb-6">Add New Ebook</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("title", { required: true })} placeholder="Ebook Title" className="input input-bordered w-full" />
        <input {...register("genre", { required: true })} placeholder="Genre (e.g. Fiction)" className="input input-bordered w-full" />
        <input {...register("price", { required: true })} type="number" placeholder="Price" className="input input-bordered w-full" />
        <textarea {...register("description", { required: true })} placeholder="Description" className="textarea textarea-bordered w-full"></textarea>
        
        <label className="block text-sm font-medium">Cover Image</label>
        <input type="file" {...register("coverImage", { required: true })} className="file-input file-input-bordered w-full" />
        
        <button type="submit" className="btn bg-green-600 text-white w-full hover:bg-green-700">Publish Ebook</button>
      </form>
    </div>
  );
};

export default AddEbookPage;