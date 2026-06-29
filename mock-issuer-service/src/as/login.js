import { generateAuthCode, authCodeStore } from "./authz-store.js";

export default function loginHandler(req, res) {
  const {
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
    scope,
    nonce,
  } = req.body;

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
