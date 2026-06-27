
import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  genre: String,
  coverImage: String,
  writerEmail: String,
  writerName: String,
  status: { type: String, enum: ['published', 'unpublished'], default: 'published' },
  isSold: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Ebook || mongoose.model("Ebook", ebookSchema);