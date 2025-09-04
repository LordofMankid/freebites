import { getStorage } from "@/lib/firebaseAdmin";
import { getDownloadURL } from "firebase-admin/storage";
// firebaseAdmin.ts
export const fetchAdminImageURL = async (path: string): Promise<string> => {
  const bucket = getStorage().bucket();
  const file = bucket.file(path);

  const url = await getDownloadURL(file);

  return url;
};
