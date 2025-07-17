/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import { getAllUsers, getUserById, putUserController } from "./controller";
import { UserType } from "@freebites/freebites-types";
import { verifySessionCookie } from "@/lib/verifySession";

export async function GET(req: Request) {
  try {
    await verifySessionCookie();

    const { searchParams } = new URL(req.url);

    const uid = searchParams.get("uid");

    if (uid) {
      const user = await getUserById(uid);
      // console.log(user);
      return NextResponse.json(user);
    } else {
      const users = await getAllUsers();
      return NextResponse.json(users);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get user: ${error}` },
      { status: 500 }
    );
  }
}

// export async function PUT(req: Request) {
//   try {
//     const userData: UserType = await req.json();
//     const updatedUser = await putUserController(userData);
//     return NextResponse.json(updatedUser);
//   } catch (error) {
//     return NextResponse.json(
//       { error: `Failed to update user: ${error}` },
//       { status: 500 }
//     );
//   }
// }
