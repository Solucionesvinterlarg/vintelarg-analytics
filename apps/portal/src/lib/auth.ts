/**
 * Cliente OIDC (Relying Party) del Portal contra el IdP de vintelarg-auth.
 * Authorization Code Flow + PKCE (S256). Server-only (node:crypto + fetch).
 * Mismo patrón que vintelarg-crm.
 *
 * Endpoints del IdP (@better-auth/oauth-provider, base /api/auth):
 *   authorize → /oauth2/authorize   token → /oauth2/token
 *   userinfo  → /oauth2/userinfo    jwks  → /jwks
 * El id_token trae los claims custom (org_id, org_name, role, user_type).
 */
import { createHash, randomBytes } from "node:crypto";
import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";
import type { PortalUser } from "./session-token";

const issuer = process.env.AUTH_ISSUER ?? "http://localhost:3000";
const oidcBase = process.env.AUTH_OIDC_BASE ?? `${issuer}/api/auth`;

export const oidc = {
  issuer,
  oidcBase,
  clientId: process.env.AUTH_CLIENT_ID ?? "",
  clientSecret: process.env.AUTH_CLIENT_SECRET ?? "",
  redirectUri: process.env.AUTH_REDIRECT_URI ?? "http://localhost:3002/api/auth/callback",
  scopes: ["openid", "profile", "email", "organization"],
  authorizeUrl: `${oidcBase}/oauth2/authorize`,
  tokenUrl: `${oidcBase}/oauth2/token`,
  userinfoUrl: `${oidcBase}/oauth2/userinfo`,
  jwksUrl: `${oidcBase}/jwks`,
};

const jwks = createRemoteJWKSet(new URL(oidc.jwksUrl));

export function randomString(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function pkceChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function getAuthorizationUrl(args: {
  state: string;
  nonce: string;
  codeChallenge: string;
}): string {
  const u = new URL(oidc.authorizeUrl);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", oidc.clientId);
  u.searchParams.set("redirect_uri", oidc.redirectUri);
  u.searchParams.set("scope", oidc.scopes.join(" "));
  u.searchParams.set("state", args.state);
  u.searchParams.set("nonce", args.nonce);
  u.searchParams.set("code_challenge", args.codeChallenge);
  u.searchParams.set("code_challenge_method", "S256");
  return u.toString();
}

export interface TokenResponse {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: oidc.redirectUri,
    client_id: oidc.clientId,
    client_secret: oidc.clientSecret,
    code_verifier: codeVerifier,
  });
  const res = await fetch(oidc.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`token endpoint ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function verifyIdToken(
  idToken: string,
  expectedNonce?: string
): Promise<JWTPayload> {
  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: [oidc.issuer, oidc.oidcBase],
    audience: oidc.clientId,
  });
  if (expectedNonce && payload.nonce !== expectedNonce) {
    throw new Error("nonce mismatch");
  }
  return payload;
}

export function claimsToUser(payload: JWTPayload): PortalUser {
  return {
    id: String(payload.sub ?? ""),
    name: String(payload.name ?? ""),
    email: String(payload.email ?? ""),
    role: String((payload as Record<string, unknown>).role ?? ""),
    orgId: String((payload as Record<string, unknown>).org_id ?? ""),
    orgName: String((payload as Record<string, unknown>).org_name ?? ""),
    userType: String((payload as Record<string, unknown>).user_type ?? ""),
  };
}
