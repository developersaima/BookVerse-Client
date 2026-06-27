import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [jwtClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;

export const signInGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
  });
};