import { cookies } from "next/headers";
import { verifyIdToken } from "./firebaseAdmin";

export async function verifySessionCookie() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return await verifyIdToken(token);
}
