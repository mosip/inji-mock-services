import { authServerBaseUrl, hasExplicitVersion, resolveRequestVersion } from "../issuer-profile.js";

// Set MOCK_AS_PAR_ENABLED=false to advertise an AS without PAR (tests the fallback path).
const PAR_ENABLED = (process.env.MOCK_AS_PAR_ENABLED ?? "true").toLowerCase() !== "false";

export default function authServerMetadata(req, res) {
  const version = resolveRequestVersion(req);
  const flow = req.params?.flow === "pdi" ? "pdi" : null;
  const asIssuer = authServerBaseUrl(version, hasExplicitVersion(req), flow);

  const response = {
    // The "issuer" of this Authorization Server
    issuer: asIssuer,

    // Where the wallet will send the user for interactive authorization
    authorization_endpoint: `${asIssuer}/authorize`,

    // Where the wallet will later exchange the code for tokens
    token_endpoint: `${asIssuer}/token`,

    // For our simple IAR flow we just support the classic OAuth code flow
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],

    // We want wallets to use PKCE S256
    code_challenge_methods_supported: ["S256"],

    // Nice to have: helps debuggers & wallet UIs
    scopes_supported: ["degree.read", "jwt_vc_json.read", "openid"],
    token_endpoint_auth_methods_supported: ["none"],
  };

  if (flow === "pdi") {
    response.interactive_authorization_endpoint = `${asIssuer}/interactive-authorization`;
  }

  if (PAR_ENABLED) {
    response.pushed_authorization_request_endpoint = `${asIssuer}/par`;
  }

  res.json(response);
}
