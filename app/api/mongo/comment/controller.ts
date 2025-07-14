import { CommentSchema, Comment } from "@freebites/freebites-types";
import getAccountConnection from "@/lib/mongoAccounts";
import mongoose from "mongoose";

let CommentModel: mongoose.Model<Comment> | null = null;

export const getCommentModel = async (): Promise<mongoose.Model<Comment>> => {
  if (CommentModel) return CommentModel;

  const conn = await getAccountConnection();

  CommentModel =
    conn.models.Comment ||
    conn.model<Comment>("Comment", CommentSchema, "profiles");
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
