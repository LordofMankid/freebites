import { getUserModel } from "./controller";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const User = await getUserModel();

  const user = await User.findOne({ uid: "4CZts4lv6XYWhUpQlt8BMBJNlNF2" });
  console.log(user);
  return Response.json(user);
}
