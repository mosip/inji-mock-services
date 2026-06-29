import { generateAuthCode, authCodeStore, loginTransactionStore } from "./authz-store.js";

export default function loginHandler(req, res) {
  const { login_txn } = req.body;

  // Load the authorization-request params from server-side state, never from the
  // browser body — the login form's hidden fields can be tampered with before POST.
  const txn = loginTransactionStore.get(login_txn);
  if (!txn || txn.expires_at < Date.now()) {
    loginTransactionStore.delete(login_txn);
    return res.status(400).send("invalid or expired login session");
  }
  loginTransactionStore.delete(login_txn); // single-use

  const {
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
    scope,
    nonce,
  } = txn;

  const code = generateAuthCode();

  authCodeStore.set(code, {
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
    scope,
    nonce,
    created_at: Date.now()
  });

  const redirectURL = new URL(redirect_uri);
  redirectURL.searchParams.set("code", code);

  if (state) redirectURL.searchParams.set("state", state);

  return res.redirect(302, redirectURL.toString());
}
