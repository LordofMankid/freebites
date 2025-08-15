import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, deletePost } from "../api/admin";

// hooks that moodifying reports/comments that are compatible with use query client
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return await deletePost(postId);
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-reports"] });
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      return await deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment-reports"] });
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
    },
  });
};
