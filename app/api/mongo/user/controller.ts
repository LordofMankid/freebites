import { UserSchemaDefinition, UserType } from "@freebites/freebites-types";
import getAccountConnection from "@/lib/mongoAccounts";
import mongoose from "mongoose";

let UserModel: mongoose.Model<UserType> | null = null;

export async function getUserModel(): Promise<mongoose.Model<UserType>> {
  if (UserModel) return UserModel;

  const conn = await getAccountConnection();

  UserModel =
    conn.models.User ||
    conn.model<UserType>("User", UserSchemaDefinition, "profiles");
  return UserModel;
}
