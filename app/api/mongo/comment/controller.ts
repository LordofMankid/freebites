import { CommentSchema, Comment } from "@freebites/freebites-types";
import mongoose, { DeleteResult } from "mongoose";
import connectToDatabase from "@/lib/mongodb";

let CommentModel: mongoose.Model<Comment> | null = null;

export const getCommentModel = async (): Promise<mongoose.Model<Comment>> => {
  if (CommentModel) return CommentModel;

  const conn = await connectToDatabase();

  CommentModel =
    conn.models.Comment ||
    conn.model<Comment>("Comment", CommentSchema, "comments");
  return CommentModel;
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const Comment = await getCommentModel();
  return Comment.find({ postId }).exec();
};

export const getCommentById = async (id: string): Promise<Comment> => {
  const Comment = await getCommentModel();
  try {
    const comment = await Comment.findOne({ _id: id }).exec();
    if (comment) return comment;
    else throw new Error("Comment not found!");
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

export const deleteComment = async (id: string): Promise<DeleteResult> => {
  const Comment = await getCommentModel();
  try {
    const comment = await Comment.deleteOne({ _id: id }).exec();
    if (comment) return comment;
    else throw new Error("Comment not found!");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
