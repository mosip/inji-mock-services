import crypto from "crypto";
import fs from "fs";
import path from "path";
import { hasExplicitVersion, resolveRequestVersion } from "../issuer-profile.js";
import { parRequestStore, loginTransactionStore } from "./authz-store.js";

// A login transaction binds the server-trusted authorization-request params to an
// opaque id, so the browser cannot tamper with them via the login form's hidden fields.
const LOGIN_TXN_EXPIRES_IN = 300; // seconds

export default function authorizeHandler(req, res) {
  let {
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
    scope,
    nonce,
  } = req.query;
  const { request_uri } = req.query;

  // PAR (RFC 9126): if a request_uri is supplied, resolve the pushed parameters
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
    // client_id sent to the authorization endpoint must match the pushed one (RFC 9126 §4)
    if (client_id && client_id !== stored.client_id) {
      return res.status(400).send("client_id does not match the pushed authorization request");
    }
    client_id = stored.client_id;
    redirect_uri = stored.redirect_uri;
    state = stored.state;
    code_challenge = stored.code_challenge;
    code_challenge_method = stored.code_challenge_method;
    scope = stored.scope;
    nonce = stored.nonce;
    // request_uri is single-use
    parRequestStore.delete(request_uri);
  }

  const version = resolveRequestVersion(req);
  const flowSegment = req.params?.flow === "pdi" ? "/pdi" : "";
  const loginAction = hasExplicitVersion(req)
    ? `/${version}${flowSegment}/as/login`
    : `${flowSegment}/as/login`;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("missing client_id or redirect_uri");
  }

  console.log("Serving login page for client_id:", client_id);
  console.log("Redirect URI:", redirect_uri);

  // Bind the params to a server-side login transaction; the form carries only the opaque id.
  const loginTxn = crypto.randomBytes(16).toString("hex");
  loginTransactionStore.set(loginTxn, {
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
    scope,
    nonce,
    expires_at: Date.now() + LOGIN_TXN_EXPIRES_IN * 1000,
  });
  setTimeout(() => loginTransactionStore.delete(loginTxn), LOGIN_TXN_EXPIRES_IN * 1000).unref();

  // Load template
  const template = fs.readFileSync(
    path.resolve("src/as/login-page.html"),
    "utf8"
  );

  // Replace placeholders
  const html = template
    .replace("{{form_action}}", loginAction)
    .replace("{{login_txn}}", loginTxn);

  res.set("Content-Type", "text/html");
  res.send(html);
}
