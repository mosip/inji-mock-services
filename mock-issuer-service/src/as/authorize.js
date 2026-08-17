import fs from "fs";
import path from "path";
import { issuerStateStore, stageTestErrorStore, parRequestStore } from "./authz-store.js";
import { hasExplicitVersion, resolveRequestVersion } from "../issuer-profile.js";
import { envTestError } from "../test-errors.js";

export default function authorizeHandler(req, res) {
  let { client_id, redirect_uri, state, issuer_state, dpop_jkt } = req.query;
  let { code_challenge, code_challenge_method, scope, nonce } = req.query;
  const { request_uri } = req.query;

  // PAR (RFC 9126): when a request_uri is supplied, the authorization request was
  // pushed directly by the client, so read the parameters from server-side state
  // instead of the query string.
  if (request_uri) {
    console.log(`Authorize via PAR — resolving request_uri …${request_uri.slice(-8)}`);
    const stored = parRequestStore.get(request_uri);
    if (!stored) {
      return res.status(400).send("invalid or unknown request_uri");
    }
    if (stored.expires_at < Date.now()) {
      parRequestStore.delete(request_uri);
      return res.status(400).send("request_uri has expired");
    }
    // The client_id at the authorization endpoint must match the pushed one (RFC 9126 §4)
    if (client_id && client_id !== stored.client_id) {
      return res.status(400).send("client_id does not match the pushed authorization request");
    }
    ({ client_id, redirect_uri, state, code_challenge, code_challenge_method,
       scope, nonce, issuer_state, dpop_jkt } = stored);
    // request_uri is single-use
    parRequestStore.delete(request_uri);
  }

  const version = resolveRequestVersion(req);
  const flowSegment = req.params?.flow === "pdi" ? "/pdi" : "";
  const loginAction = hasExplicitVersion(req)
    ? `/${version}${flowSegment}/as/login`
    : `${flowSegment}/as/login`;
  console.log("Looking for HTML at:", path.resolve("src/as/login-page.html"));

  if (!client_id || !redirect_uri) {
    return res.status(400).send("missing client_id or redirect_uri");
  }

  const issuerStateEntry = issuer_state ? issuerStateStore.get(issuer_state) : null;
  const testError = envTestError("authorization") || issuerStateEntry?.testError || stageTestErrorStore.get("authorization");
  if (testError?.stage === "authorization") {
    if (issuer_state) issuerStateStore.delete(issuer_state);
    stageTestErrorStore.delete("authorization");
    const redirectURL = new URL(redirect_uri);
    redirectURL.searchParams.set("error", testError.responseCode);
    redirectURL.searchParams.set("error_description", testError.description);
    if (state) redirectURL.searchParams.set("state", state);
    return res.redirect(302, redirectURL.toString());
  }

  if (dpop_jkt) {
    console.log("dpop_jkt received in authorization request:", dpop_jkt);
  }

  console.log("Serving login page for client_id:", client_id);
  console.log("Redirect URI:", redirect_uri);

  // Load template
  const template = fs.readFileSync(
    path.resolve("src/as/login-page.html"),
    "utf8"
  );

  // Replace placeholders
  const html = template
    .replace("{{client_id}}", client_id)
    .replace("{{redirect_uri}}", redirect_uri)
    .replace("{{form_action}}", loginAction)
    .replace("{{state}}", state || "")
    .replace("{{issuer_state}}", issuer_state || "")
    .replace("{{dpop_jkt}}", dpop_jkt || "")
    // Carried so PKCE survives to the token endpoint; under PAR these came from
    // the pushed request rather than the query string.
    .replace("{{code_challenge}}", code_challenge || "")
    .replace("{{code_challenge_method}}", code_challenge_method || "")
    .replace("{{scope}}", scope || "")
    .replace("{{nonce}}", nonce || "");

  res.set("Content-Type", "text/html");
  res.send(html);
}
