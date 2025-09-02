import { NextResponse } from "next/server";
import { getPostComments, getCommentById, deleteComment } from "./controller";
import { verifySessionCookie } from "@/lib/verifySession";

export async function DELETE(req: Request) {
  try {
    await verifySessionCookie();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    if (id) {
      const comment = await getCommentCount(id);
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
