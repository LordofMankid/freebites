import mongoose from "mongoose";

const MONGO_ACCOUNTS_URI = process.env.MONGO_ACCOUNTS_URI!;
if (!MONGO_ACCOUNTS_URI) throw new Error("Missing MONGO_ACCOUNTS_URI");

let accountConnection: mongoose.Connection | null = null;

export default async function getAccountConnection(): Promise<mongoose.Connection> {
  if (accountConnection) return accountConnection;

  const conn = await mongoose
    .createConnection(MONGO_ACCOUNTS_URI, {
      bufferCommands: false,
    })
    .asPromise();

  accountConnection = conn;
  return conn;
}
