import connectToDatabase from "@/lib/mongodb";
import { PostType, PostSchemaDefinition } from "@freebites/freebites-types";
import mongoose from "mongoose";

let PostModel: mongoose.Model<PostType> | null = null;

export const getPostModel = async (): Promise<mongoose.Model<PostType>> => {
  if (PostModel) return PostModel;

  const conn = await connectToDatabase();

  PostModel =
    conn.models.Post ||
    conn.model<PostType>("freebites", PostSchemaDefinition, "Posts");
  return PostModel;
};

export const getAllPosts = async (): Promise<PostType[]> => {
  const Post = await getPostModel();
  return Post.find({}).exec();
};

export const getPostById = async (id: string): Promise<PostType> => {
  const Post = await getPostModel();
  try {
    const post = await Post.findOne({ _id: id }).exec();
    if (post) return post;
    else throw new Error("Post not found!");
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

/**
 *
 * putPostController takes in the updated post data and updates it in mongoDB.
 * @param postData - the updated post data
 * @returns - the updated post
 */
export const putPostController = async (
  postData: PostType
): Promise<PostType> => {
  try {
    const Post = await getPostModel();
    if (!postData._id) {
      throw new Error("Missing required information");
    }

    const updatedPost = await Post.findOneAndReplace(
      { id: postData._id },
      postData,
      {
        new: true,
      }
    )
      .lean() // save as javascript document for less overhead
      .exec();

    if (!updatedPost) {
      throw new Error(`Post with id ${postData._id} not found`);
    }

    return updatedPost;
  } catch (error) {
    console.error("Error updating post", error);
    throw error;
  }
};
