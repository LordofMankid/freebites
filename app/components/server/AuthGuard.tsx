import { verifyIdToken } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserType, UserSchemaDefinition } from "@freebites/freebites-types";
import getAccountConnection from "@/lib/mongoAccounts";
export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;

  if (!token) {
    redirect("/admin/login?logout=1");
  }
  try {
    const decodedToken = await verifyIdToken(token);
    // console.log(decodedToken);

    const conn = await getAccountConnection();

    const UserModel =
      conn.models.User ||
      conn.model<UserType>("User", UserSchemaDefinition, "profiles");

    const user = await UserModel.findOne({
      uid: decodedToken.uid,
    }).exec();
    if (!user || !user.isAdmin)
      throw new Error("user not found or not an admin");

    // Token is valid and mongo admin status verified, render children
    return <>{children}</>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect("/admin/login?logout=2");
  }
}
