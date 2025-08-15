import { NextResponse } from "next/server";
import {
  ignoreAllReportsForPost,
  ignoreAllReportsForComment,
  ignoreAllReportsForUser,
} from "./controller";
import { UpdateWriteOpResult } from "mongoose";

export async function PATCH(req: Request) {
  try {
    const { action, id } = await req.json();

    let result: UpdateWriteOpResult;
    switch (action) {
      case "Post":
        if (!id) throw new Error("postId required");
        result = await ignoreAllReportsForPost(id);
        return NextResponse.json(result);

      case "Comment":
        if (!id) throw new Error("commentId required");
        result = await ignoreAllReportsForComment(id);
        return NextResponse.json(result);

      case "User":
        if (!id) throw new Error("userId required");
        result = await ignoreAllReportsForUser(id);
        return NextResponse.json(result);

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to perform bulk action: ${error}` },
      { status: 500 }
    );
  }
}
