import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE_NAME = "kidsmart_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function secret() {
  return process.env.SESSION_SECRET || "dev-secret-tukar-di-production";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export async function createSession(userId: string) {
  const token = `${userId}.${sign(userId)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [userId, sig] = token.split(".");
  if (!userId || !sig || sign(userId) !== sig) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return test.length === expected.length && crypto.timingSafeEqual(test, expected);
}
