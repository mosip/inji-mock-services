import { STATIC_LDP_VC, STATIC_JWT_VC } from "./static-vc.js";
// import { accessTokenStore } from "../as/authz-store.js";

// ADD THIS HELPER: Necessary because JWTs must be strings, while LDP is raw JSON
const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const SUPPORTED_FORMATS = ["ldp_vc", "jwt_vc", "jwt_vc_json"];

export default function credentialEndpoint(req, res) {
  const {format, proof } = req.body;

  

//   const tokenData = accessTokenStore.get(access_token);
//   if (!tokenData) {
//     return res.status(401).json({ error: "invalid_token" });
//   }

  // ---- Validate format ----
  // I updated this single line to allow jwt_vc, otherwise the code rejects it immediately.
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
    const header = encode({ alg: "ES256", typ: "JWT" });
    const payload = encode(STATIC_JWT_VC); 
    // FIX: Encode the signature string to Base64URL
    const signature = Buffer.from("mock_signature_for_download_test").toString('base64url');

    return res.json({
      format: "jwt_vc_json",
      credential: `${header}.${payload}.${signature}`, // Returns the required Header.Payload.Signature string
      c_nonce: "mock_nonce_123",
      c_nonce_expires_in: 86400
    });
  }

  // ---- Return STATIC VC ----
  return res.json({
    format: "ldp_vc",
    credential: STATIC_LDP_VC
  });
}
