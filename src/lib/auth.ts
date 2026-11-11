import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE = "khadys_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (at least 32 characters).");
  return new TextEncoder().encode(s);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set.");
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Call at the top of every admin page and every server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
