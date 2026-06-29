import crypto from "crypto";
import { parRequestStore } from "./authz-store.js";

// RFC 9126 — Pushed Authorization Requests
const PAR_EXPIRES_IN = 90; // seconds

export default function parHandler(req, res) {
  const {
    response_type,
    client_id,
    redirect_uri,
    code_challenge,
    code_challenge_method,
    scope,
    state,
    nonce,
    request_uri,
  } = req.body;

  console.log("PAR request received for client_id:", client_id);

  // A PAR request MUST NOT itself contain a request_uri (RFC 9126 §2.1)
  if (request_uri) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: "request_uri is not allowed in a pushed authorization request"
    });
  }

  if (!client_id) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: "client_id is required"
    });
  }

  if (!redirect_uri) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: "redirect_uri is required"
    });
  }

  if (response_type && response_type !== "code") {
    return res.status(400).json({
      error: "unsupported_response_type",
      error_description: "only response_type=code is supported"
    });
  }

  const requestUri = `urn:ietf:params:oauth:request_uri:${crypto.randomBytes(16).toString("hex")}`;

  parRequestStore.set(requestUri, {
    response_type: response_type || "code",
    client_id,
    redirect_uri,
    code_challenge,
    code_challenge_method,
    scope,
    state,
    nonce,
    expires_at: Date.now() + PAR_EXPIRES_IN * 1000
  });

  console.log(`PAR issued request_uri: ${requestUri} (expires in ${PAR_EXPIRES_IN}s)`);

  // RFC 9126 §2.2 — success response is HTTP 201
  res.setHeader("Cache-Control", "no-store");
  return res.status(201).json({
    request_uri: requestUri,
    expires_in: PAR_EXPIRES_IN
  });
}
