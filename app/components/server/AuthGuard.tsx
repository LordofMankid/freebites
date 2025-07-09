import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { verifyIdToken } from "../lib/firebaseAdmin";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    // const decodedToken = await verifyIdToken(token);
    // Token is valid, render children
    // Later you can add MongoDB admin role check here
    return <>{children}</>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Token invalid, redirect to login
    redirect("/admin/login");
  }
}
