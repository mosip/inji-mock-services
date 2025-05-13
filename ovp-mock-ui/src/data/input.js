import { nonce, state, responseUri, didDocumentUrl, requestUri, presentationDefinitionUri } from "./constant";
import clientMetadata from './client-metadata.json';


const client_metadata = JSON.stringify(clientMetadata);

// Auth request by value 
const preRegisteredAuthorizationRequest = {
    "client_id": "mock-client",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}
const redirectAuthorizationRequest = {
    "client_id": `redirect_uri:${responseUri}`,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

// Auth request by reference
// const preRegisteredAuthorizationRequestParams = {
//     "client_id": "mock-client",
//     "request_uri": requestUri,
//     "request_uri_method": "post"
// }
// const redirectAuthorizationRequestParams = {
//     "client_id": `redirect_uri:${responseUri}`,
//     "request_uri": requestUri,
//     "request_uri_method": "post"
// }
const didAuthorizationRequestParams = {
    "client_id":didDocumentUrl,
    "request_uri": requestUri,
    "request_uri_method": "post"
}

export {
    preRegisteredAuthorizationRequest,
    redirectAuthorizationRequest,
    // preRegisteredAuthorizationRequestParams,
    // redirectAuthorizationRequestParams,
    didAuthorizationRequestParams,
}