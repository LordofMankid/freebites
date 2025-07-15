import { NextResponse } from "next/server";
import { getPostComments, getCommentById } from "./controller";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const postId = searchParams.get("postId");
    if (id) {
      const comment = await getCommentById(id);
      // console.log(comment);
      return NextResponse.json(comment);
    } else if (postId) {
      const comments = await getPostComments(postId);
      return NextResponse.json(comments);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get comment: ${error}` },
      { status: 500 }
    );
  }
}
