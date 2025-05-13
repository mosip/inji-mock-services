const ed25519PublicKey = "IKXhA7W1HD1sAl+OfG59VKAqciWrrOL1Rw5F+PGLhi4="
const ed25519PrivateKey = "vlo/0lVUn4oCEFo/PiPi3FyqSBSdZ2JDSBJJcvbf6o0="

const baseUrl = "https://2082-2405-201-6000-80ae-a921-f2ac-e160-2b2a.ngrok-free.app"
const requestUri = `${baseUrl}/verifier/get-auth-request-obj`
const responseUri = `${baseUrl}/verifier/vp-response`
const presentationDefinitionUri  = `${baseUrl}/verifier/presentation_definition_uri`
const didDocumentUrl = "did:web:mosip.github.io:inji-mock-services:openid4vp-service:docs"
const clientId  = "http://mock-verifier"
const publicKeyId = "did:web:mosip.github.io:inji-mock-services:openid4vp-service:docs#key-0"



function generateRandomBase64(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
}

const nonce =generateRandomBase64(16);
const state =generateRandomBase64(16);

export {
    baseUrl,
    nonce,
    state,
    ed25519PublicKey,
    ed25519PrivateKey,
    requestUri,
    responseUri,
    didDocumentUrl,
    publicKeyId,
    clientId,
    presentationDefinitionUri
};