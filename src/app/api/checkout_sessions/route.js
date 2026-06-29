// checkout session route
// next js

import { NextResponse } from "next/server";

import { headers } from "next/headers";

import  stripe  from "@/lib/stripe";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL;

export async function POST(req) {
  const body = await req.json();

  const ebookId = body?.ebookId;

  if (!ebookId) {
    return NextResponse.json(
      {
        success: false,
        message: "Ebook id required",
      },
      {
        status: 400,
      }
    );
  }

  // ebook from backend
  const ebookRes = await fetch(
    `${API_BASE}/api/ebooks/${ebookId}`
  );

  const ebook = await ebookRes.json();

  const headersList = await headers();

  const origin =
    headersList.get("origin");

  const session =
    await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: ebook.title,
            },

            unit_amount:
              Number(ebook.price) * 100,
          },

          quantity: 1,
        },
      ],

      success_url: `${origin}/success?ebookId=${ebook._id}&amount=${ebook.price}`,

      cancel_url: `${origin}/ebooks/${ebook._id}`,
    });

  return NextResponse.json({
    success: true,
    url: session.url,
  });
}