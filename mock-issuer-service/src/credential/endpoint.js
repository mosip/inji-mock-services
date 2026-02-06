import { STATIC_LDP_VC, STATIC_JWT_VC } from "./static-vc.js";
import { SignJWT, generateKeyPair, exportJWK, calculateJwkThumbprint } from 'jose';
// import { accessTokenStore } from "../as/authz-store.js";

// ADD THIS HELPER: Necessary because JWTs must be strings, while LDP is raw JSON
const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const SUPPORTED_FORMATS = ["ldp_vc", "jwt_vc", "jwt_vc_json"];

export default async function credentialEndpoint(req, res) {
  const {format, proof } = req.body;

  

//   const tokenData = accessTokenStore.get(access_token);
//   if (!tokenData) {
//     return res.status(401).json({ error: "invalid_token" });
//   }

  // ---- Validate format ----
  if (!SUPPORTED_FORMATS.includes(format)) {
    return res.status(400).json({
      error: "unsupported_credential_format"
    });
  }

  // ---- Validate proof (mock) ----
  // MOVED UP: Check proof BEFORE returning JWT to satisfy CodeRabbit
  if (!proof || !proof.jwt) {
    return res.status(400).json({
      error: "invalid_proof",
      error_description: "proof.jwt missing"
    });
  }

  // ---- JWT VC Logic (Added for INJIMOB-3752) ----
  if (format === "jwt_vc" || format === "jwt_vc_json") {
    try {
      // 1. Generate a real Key Pair (ES256) on the fly
      const { privateKey, publicKey } = await generateKeyPair('ES256');
      
      // 2. Create the DID:JWK from the public key
      const publicJwk = await exportJWK(publicKey);
      // Construct the standard did:jwk string (this allows the verifier to decode the key)
      const didJwk = `did:jwk:${Buffer.from(JSON.stringify(publicJwk)).toString('base64url')}`;
      
      // 3. Prepare the Payload 
      const vcPayload = { 
        ...STATIC_JWT_VC, 
        iss: didJwk,  
        sub: didJwk   // Usually the holder, but for mock testing self-issued is safest
      };

      // 4. Sign it (Using Cryptography!)
      const jwt = await new SignJWT(vcPayload)
        .setProtectedHeader({ alg: 'ES256', typ: 'JWT', kid: didJwk })
        .setIssuedAt()
        .setExpirationTime('1y')
        .sign(privateKey);

      // 5. Return the Valid JWT
      return res.json({
        format: "jwt_vc_json",
        credential: jwt, 
        c_nonce: "mock_nonce_123",
        c_nonce_expires_in: 86400
      });

    } catch (error) {
      console.error("Signing failed:", error);
      return res.status(500).json({ error: "signing_error" });
    }
  }

  // ---- Return STATIC VC ----
  return res.json({
    format: "ldp_vc",
    credential: STATIC_LDP_VC
  });
}
