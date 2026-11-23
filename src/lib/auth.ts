import { SignJWT, jwtVerify } from 'jose';
import type { AuthPayload } from '@/types';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret');
export const COOKIE_NAME = 'pbs_auth';
export const ADMIN_COOKIE_NAME = 'pbs_admin_auth';
const EXPIRY = '7d';

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

// User auth — checks pbs_auth cookie
export async function getAuthFromCookies(): Promise<AuthPayload | null> {
  const cookieStore = cookies();
  // Check admin cookie first
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const payload = await verifyToken(adminToken);
    if (payload?.role === 'admin') return payload;
  }
  // Fall back to user cookie
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}