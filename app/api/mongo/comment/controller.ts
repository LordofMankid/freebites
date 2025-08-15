import { CommentSchema, Comment } from "@freebites/freebites-types";
import mongoose, { startSession } from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { ReportStatus } from "@freebites/freebites-types/dist/ReportTypes";

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

export const deleteComment = async (id: string): Promise<Comment | null> => {
  const Comment = await getCommentModel();
  const session = await startSession();

  try {
    if (!id) {
      throw new Error("Missing required information");
    }

    let deletedComment: Comment | null = null;

    await session.withTransaction(async () => {
      deletedComment = await Comment.findByIdAndDelete(id)
        .session(session)
        .lean()
        .exec();

      if (!deletedComment) {
        throw new Error(`Comment with id ${id} not found`);
      }

      const resolvedCommentsResult = await Comment.updateMany(
        { postID: id, status: { $ne: ReportStatus.RESOLVED } },
        {
          status: ReportStatus.RESOLVED,
          resolvedAt: new Date(),
          adminNotes: "Post deleted by admin",
        },
        { session }
      );

      console.log(
        `Resolved ${resolvedCommentsResult.modifiedCount} reports for post ${id}`
      );
    });

    return deletedComment;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
