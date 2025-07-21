import { PostWithUser } from "@/lib/api/admin";
import connectToDatabase from "@/lib/mongodb";
import { PostType, PostSchemaDefinition } from "@freebites/freebites-types";
import mongoose from "mongoose";
import { getUserModel } from "../user/controller";
import { getStorage } from "@/lib/firebaseAdmin";

let PostModel: mongoose.Model<PostType> | null = null;

export const getPostModel = async (): Promise<mongoose.Model<PostType>> => {
  if (PostModel) return PostModel;

  const conn = await connectToDatabase();

  PostModel =
    conn.models.Post ||
    conn.model<PostType>("Posts", PostSchemaDefinition, "Posts");
  return PostModel;
};

export const getAllPosts = async (): Promise<PostWithUser[]> => {
  const Post = await getPostModel();
  const User = await getUserModel();

  try {
    const posts = Post.find({}).exec();

    // create a set of all the unique posters
    const posterIds = [...new Set((await posts).map((post) => post.postedBy))];

    // connect to the user database and fetch user data of the posters

    const posters = await User.find({ uid: { $in: posterIds } }).exec();

    // create a map for fast lookup
    const posterMap = Object.fromEntries(
      posters.map((poster) => [poster.uid, poster])
    );

    // combine the fields
    const postsWithUsers = (await posts).map((post) => ({
      ...post.toObject(),
      posterInfo: posterMap[post.postedBy].toObject() ?? null, // null is where user's account got deleted
    }));

    return postsWithUsers;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPostById = async (id: string): Promise<PostWithUser> => {
  const Post = await getPostModel();
  const User = await getUserModel();
  try {
    const post = await Post.findOne({ _id: id }).exec();

    const user = await User.findOne({ uid: post?.postedBy }).exec();

    if (post)
      return { ...post.toObject(), posterInfo: user?.toObject() ?? null };
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

/**
 *
 * deletePostController takes in a post id and deletes the post
 * @param postData - the post id to delete
 * @returns - the deleted post
 */
export const deletePostController = async (
  postId: string
): Promise<PostType> => {
  try {
    const Post = await getPostModel();
    if (!postId) {
      throw new Error("Missing required information");
    }

    const deletedPost = await Post.findByIdAndDelete(postId)
      .lean() // save as javascript document for less overhead
      .exec();

    if (!deletedPost) {
      throw new Error(`Post with id ${postId} not found`);
    }

    const bucket = getStorage().bucket(); // This uses your initialized admin app
    await Promise.all(
      deletedPost.imageURIs.map(async (imagePath: string) => {
        try {
          await bucket.file(imagePath).delete();
        } catch (error) {
          console.warn(
            `Failed to delete Firebase Storage file at ${imagePath}:`,
            error
          );
        }
      })
    );

    return deletedPost;
  } catch (error) {
    console.error("Error updating post", error);
    throw error;
  }
};
