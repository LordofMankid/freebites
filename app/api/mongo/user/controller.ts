import { UserSchemaDefinition, UserType } from "@freebites/freebites-types";
import getAccountConnection from "@/lib/mongoAccounts";
import mongoose from "mongoose";

let UserModel: mongoose.Model<UserType> | null = null;

export const getUserModel = async (): Promise<mongoose.Model<UserType>> => {
  if (UserModel) return UserModel;

  const conn = await getAccountConnection();

  UserModel =
    conn.models.User ||
    conn.model<UserType>("User", UserSchemaDefinition, "profiles");
  return UserModel;
};

export const getAllUsers = async (): Promise<UserType[]> => {
  const User = await getUserModel();
  return User.find({}).exec();
};

export const getUserById = async (uid: string): Promise<UserType> => {
  const User = await getUserModel();
  try {
    const user = await User.findOne({ uid: uid }).exec();
    if (user) return user;
    else {
      throw new Error("User not found!");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 *
 * putUserController takes in the updated user data and updates it in mongoDB.
 * @param userData - the updated user data
 * @returns - the updated user
 */
export const putUserController = async (
  userData: UserType
): Promise<UserType> => {
  try {
    const User = await getUserModel();
    if (!userData.uid) {
      throw new Error("Missing required information");
    }

    const updatedUser = await User.findOneAndReplace(
      { uid: userData.uid },
      userData,
      {
        new: true,
      }
    )
      .lean() // save as javascript document for less overhead
      .exec();

    if (!updatedUser) {
      throw new Error(`User with uid ${userData.uid} not found`);
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};
