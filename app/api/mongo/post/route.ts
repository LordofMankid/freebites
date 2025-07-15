/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE THIS AFTER API ENDPOINT SECURING

import { NextResponse } from "next/server";
import { getAllPosts, getPostById, putPostController } from "./controller";
import { PostType } from "@freebites/freebites-types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (id) {
      const post = await getPostById(id);
      // console.log(user);
      return NextResponse.json(post);
    } else {
      const posts = await getAllPosts();
      return NextResponse.json(posts);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get post: ${error}` },
      { status: 500 }
    );
  }
}

// export async function PUT(req: Request) {
//   try {
//     const postData: PostType = await req.json();
//     const updatedPost = await putPostController(postData);
//     return NextResponse.json(updatedPost);
//   } catch (error) {
//     return NextResponse.json(
//       { error: `Failed to update post: ${error}` },
//       { status: 500 }
//     );
//   }
// }
