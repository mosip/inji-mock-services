import crypto from "crypto";
import { authCodeStore, preAuthCodeStore } from "./authz-store.js";

function base64url(str) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// RFC 7636 — verify code_verifier against the code_challenge pushed at /par or /authorize
function verifyPkce(codeVerifier, codeChallenge, codeChallengeMethod) {
  if (!codeChallenge) return true; // PKCE was not used for this authorization
  if (!codeVerifier) return false;
  if ((codeChallengeMethod || "S256") === "S256") {
    const hash = crypto.createHash("sha256").update(codeVerifier).digest("base64");
    return base64url(hash) === codeChallenge;
  }
  return codeVerifier === codeChallenge; // "plain"
}

export default function tokenHandler(req, res) {
  const {
    grant_type,
    code,
    "pre-authorized_code": preAuthorizedCode,
    tx_code: txCodeInput,
    redirect_uri,
    client_id,
    code_verifier
  } = req.body;
  console.log("Token Request:", grant_type, code || preAuthorizedCode);

  let scope;

  if (grant_type === "authorization_code") {
    // 2. Authorization code must exist
    const entry = authCodeStore.get(code);
    if (!entry) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired authorization code"
      });
    }

    // 3. Validate redirect_uri
    if (redirect_uri !== entry.redirect_uri) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "redirect_uri mismatch"
      });
    }

    // 4. Validate client_id
    if (client_id !== entry.client_id) {
      return res.status(400).json({
        error: "invalid_client",
        error_description: "client_id mismatch"
      });
    }

    // 5. Validate PKCE (RFC 7636) against the code_challenge pushed at /par or /authorize
    if (!verifyPkce(code_verifier, entry.code_challenge, entry.code_challenge_method)) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "code_verifier does not match the code_challenge"
      });
    }

    scope = entry.scope;
    authCodeStore.delete(code);
  } else if (grant_type === "urn:ietf:params:oauth:grant-type:pre-authorized_code") {
    if (!preAuthorizedCode) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "pre-authorized_code missing"
      });
    }

    const entry = preAuthCodeStore.get(preAuthorizedCode);
    if (!entry) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired pre-authorized code"
      });
    }

    if (entry.txCode) {
      if (txCodeInput === undefined || txCodeInput === null || txCodeInput === "") {
        return res.status(400).json({
          error: "invalid_request",
          error_description: "tx_code is REQUIRED for this pre-authorized_code"
        });
      }
      if (txCodeInput !== entry.txCode) {
        return res.status(400).json({
          error: "invalid_grant",
          error_description: "Invalid tx_code"
        });
      }
    }

    scope = entry.scope;
    preAuthCodeStore.delete(preAuthorizedCode);
  } else {
    return res.status(400).json({
      error: "unsupported_grant_type",
      error_description: "Only authorization_code and pre-authorized_code grants are supported"
    });
  }

  // 5. Issue access_token + c_nonce
  const accessToken = base64url(crypto.randomBytes(32).toString("base64"));
  const cNonce = base64url(crypto.randomBytes(16).toString("base64"));

  // 7. Return OAuth Token Response
  res.setHeader("Cache-Control", "no-store");
  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,

    // c_nonce for proof signing
    c_nonce: cNonce,
    c_nonce_expires_in: 300,

    scope: scope
  });
}
