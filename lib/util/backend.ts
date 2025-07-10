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
