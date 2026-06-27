import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";


if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("book-verse");

export const auth = betterAuth({
  database: mongodbAdapter(db), 
  emailAndPassword: {
    enabled: true,
  },
  session: {
    strategy: "jwt", 
  },
  plugins: [jwt()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "reader",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});