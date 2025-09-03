import {
  Comment,
  PostType,
  ReportType,
  UserType,
} from "@freebites/freebites-types";
import axios from "axios";

// comment crud
export const getComment = async (id: string): Promise<Comment> => {
  try {
    const response = await axios.get("/api/mongo/comment", {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch comment: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch comment: An unknown error occurred.`);
    }
  }
};

export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await axios.get("/api/mongo/comment", {
      params: { postId: postId },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch comments: An unknown error occurred.`);
    }
  }
};

export const deleteComment = async (id: string): Promise<Comment> => {
  try {
    const response = await axios.delete("/api/mongo/comment", {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch comment: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch comment: An unknown error occurred.`);
    }
  }
};
////////////////////////////////////////////
// post crud
export type PostWithUser = PostType & {
  posterInfo: UserType | null;
};
export const getPost = async (postId: string): Promise<PostWithUser> => {
  try {
    const response = await axios.get("/api/mongo/post", {
      params: { id: postId },
    });

    const post: PostWithUser = {
      ...response.data,
      postTime: new Date(response.data.postTime),
    };

    return post;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch post: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch post: An unknown error occurred.`);
    }
  }
};

export const getAllPosts = async (): Promise<PostWithUser[]> => {
  try {
    const response = await axios.get("/api/mongo/post");

    return response.data.map((post: PostType) => ({
      ...post,
      postTime: new Date(post.postTime),
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch posts: An unknown error occurred.`);
    }
  }
};

export const updatePost = async (updatedPost: PostType): Promise<PostType> => {
  try {
    const response = await axios.put("/api/mongo/post", updatedPost);

    const deletedPost: PostType = {
      ...response.data,
      postTime: new Date(response.data.postTime),
    };

    return deletedPost;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    } else {
      throw new Error(`Failed to delete post: An unknown error occurred.`);
    }
  }
};

export const deletePost = async (postId: string): Promise<PostType> => {
  try {
    const response = await axios.delete("/api/mongo/post", {
      params: { id: postId },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    } else {
      throw new Error(`Failed to delete post: An unknown error occurred.`);
    }
  }
};

// not a function yet but we might want it
// export const getReportsByPost = async (postId: string): Promise<PostType[]> => {
//   try {
//     const response = await axios.get("/api/mongo/report", {
//       params: { postId: postId },
//     });

//     return response.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Failed to fetch reports: ${error.message}`);
//     } else {
//       throw new Error(`Failed to fetch reports: An unknown error occurred.`);
//     }
//   }
// };

export const updateReport = async (
  reportId: string,
  updatedReport: Partial<ReportType>
): Promise<ReportType> => {
  try {
    const response = await axios.patch(
      // use patch for partial updates
      `/api/mongo/report${reportId}`,
      updatedReport
    );

    const deletedReport: ReportType = {
      ...response.data,
      postTime: new Date(response.data.postTime),
    };

    return deletedReport;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update report: ${error.message}`);
    } else {
      throw new Error(`Failed to update report: An unknown error occurred.`);
    }
  }
};

/* used for updating all reports */
export const ignoreAllReportsOnItem = async (itemId: string, type: string) => {
  try {
    await axios.patch("/api/mongo/report/bulk", {
      action: type,
      id: itemId,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to ignore reports: ${error.message}`);
    } else {
      throw new Error(`Failed to ignore reports: An unknown error occurred.`);
    }
  }
};
////////////////////////////////////////////
// user crud
export const getUser = async (userId: string): Promise<UserType> => {
  try {
    const response = await axios.get("/api/mongo/user", {
      params: { uid: userId },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch user: An unknown error occurred.`);
    }
  }
};

export const getAllUsers = async (): Promise<UserType[]> => {
  try {
    const response = await axios.get("/api/mongo/user");

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch users: An unknown error occurred.`);
    }
  }
};

export const editUser = async (UserData: UserType): Promise<UserType> => {
  try {
    const response = await axios.put("/api/mongo/user", UserData);

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch users: An unknown error occurred.`);
    }
  }
};

/////////////////
