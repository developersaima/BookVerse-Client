import connectToDatabase from "@/lib/mongodb";
import Ebook from "@/lib/models/Ebook";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    

    const newEbook = await Ebook.create(body);
    
    return NextResponse.json({ success: true, data: newEbook }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}