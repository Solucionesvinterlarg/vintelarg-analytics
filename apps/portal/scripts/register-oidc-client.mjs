// Registra el Portal como client OIDC en el IdP (vintelarg-auth) insertando en
// la tabla oauth_client de vintelarg_base. Replica lo que hace el endpoint admin
// POST /api/admin/apps:
//   clientId = "cl_" + 16 bytes hex
//   clientSecret = base64url(48 bytes).slice(0,64)
//   client_secret guardado = SHA-256(secret) base64url  (storeClientSecret="hashed")
// Idempotente: borra cualquier client previo con el mismo nombre antes de crear.
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { randomBytes, createHash, randomUUID } from "node:crypto";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "..", ".env.local") });

const NAME = "Portal A-ware (dev)";
const REDIRECT_URIS = [process.env.AUTH_REDIRECT_URI ?? "http://localhost:3002/api/auth/callback"];
const POST_LOGOUT = [process.env.APP_URL ?? "http://localhost:3002"];
const SCOPES = ["openid", "profile", "email", "organization"];

const clientId = `cl_${randomBytes(16).toString("hex")}`;
const clientSecret = randomBytes(48).toString("base64url").slice(0, 64);
const clientSecretHashed = createHash("sha256").update(clientSecret).digest("base64url");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(`DELETE FROM oauth_client WHERE name = $1`, [NAME]);

  const now = new Date();
  await pool.query(
    `INSERT INTO oauth_client (
       id, client_id, client_secret, disabled, skip_consent, scopes,
       redirect_uris, post_logout_redirect_uris, token_endpoint_auth_method,
       grant_types, response_types, public, type, require_pkce, name, metadata,
       created_at, updated_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      randomUUID(),
      clientId,
      clientSecretHashed,
      false, // disabled
      true, // skip_consent (trusted en dev)
      SCOPES,
      REDIRECT_URIS,
      POST_LOGOUT,
      "client_secret_post",
      ["authorization_code", "refresh_token"],
      ["code"],
      false, // public
      "web",
      false, // require_pkce
      NAME,
      JSON.stringify({ displayName: "Portal A-ware", primaryColor: "#685BC7" }),
      now,
      now,
    ]
  );

  console.log("OIDC client registrado en el IdP:");
  console.log("AUTH_CLIENT_ID=" + clientId);
  console.log("AUTH_CLIENT_SECRET=" + clientSecret);
} catch (err) {
  console.error("ERROR registrando client:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
