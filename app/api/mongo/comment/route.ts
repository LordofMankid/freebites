import { NextResponse } from "next/server";
import { getPostComments, getCommentById, deleteComment } from "./controller";
import { verifySessionCookie } from "@/lib/verifySession";

export async function GET(req: Request) {
  try {
    await verifySessionCookie();

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

export async function DELETE(req: Request) {
  try {
    await verifySessionCookie();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    if (id) {
      const comment = await deleteComment(id);
      // console.log(comment);
      return NextResponse.json(comment);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get comment: ${error}` },
      { status: 500 }
    );
  }
}
