import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebaseClient";

// backend fetch function to send auth cookie to server for validation
export const setAuthCookie = async (token: string) => {
  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
};

export const clearAuthCookie = async () => {
  await fetch("/api/session/logout", { method: "POST" }); // Clear cookie
};

// query fetch function to firebase to fetch firebase URLs. Used for react-query
export const fetchImageURL = async (path: string): Promise<string> => {
  // console.log("Fetching image path:", path);
  try {
    const url = await getDownloadURL(ref(storage, path));
    // console.log("Resolved URL:", url);
    return url;
  } catch (err) {
    // console.error("Error fetching image:", err);
    throw err; // Rethrow for react-query to handle
  }
};
