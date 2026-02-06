import { STATIC_LDP_VC, STATIC_JWT_VC } from "./static-vc.js";
import { SignJWT, generateKeyPair, exportJWK } from 'jose';
import { randomUUID } from 'node:crypto'; // Added for dynamic JTI
// import { accessTokenStore } from "../as/authz-store.js";

const SUPPORTED_FORMATS = ["ldp_vc", "jwt_vc", "jwt_vc_json"];

export default async function credentialEndpoint(req, res) {
  const { format, proof } = req.body;

  

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
      const didJwk = `did:jwk:${Buffer.from(JSON.stringify(publicJwk)).toString('base64url')}`;
      
      // 3. Prepare the Payload 
      // Remove static timestamps so we don't leak stale 'nbf' or 'iat' values
      const { iat, nbf, exp, ...cleanStaticVc } = STATIC_JWT_VC;

      const vcPayload = { 
        ...cleanStaticVc, 
        iss: didJwk,  
        sub: didJwk,
        jti: `urn:uuid:${randomUUID()}`, // Dynamic JTI to prevent replay issues
        // Fix: Ensure credentialSubject.id matches the subject (sub) per W3C spec
        vc: {
          ...STATIC_JWT_VC.vc,
          credentialSubject: {
            ...STATIC_JWT_VC.vc.credentialSubject,
            id: didJwk
          }
        }
      };

      // 4. Sign it (Using Cryptography!)
      const jwt = await new SignJWT(vcPayload)
        .setProtectedHeader({ alg: 'ES256', typ: 'JWT', kid: didJwk })
        .setIssuedAt()
        .setNotBefore('0s') // FIX: Set fresh 'nbf' (valid from now)
        .setExpirationTime('1y')
        .sign(privateKey);

      // 5. Return the Valid JWT
      return res.json({
        format: format, // Echo the requested format (jwt_vc or jwt_vc_json)
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
    credential: STATIC_LDP_VC,
    c_nonce: "mock_nonce_123", // Added consistency for LDP path to satify Coderabbit
    c_nonce_expires_in: 86400
  });
}
