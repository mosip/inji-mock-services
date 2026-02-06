export const STATIC_LDP_VC = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://piyush7034.github.io/my-files/farmer.json",
  ],
  issuer: "did:web:vharsh.github.io:DID:local",
  type: ["VerifiableCredential", "FarmerCredential"],
  issuanceDate: "2025-01-02T05:16:46.176Z",
  expirationDate: "2027-01-02T05:16:46.176Z",
  credentialSubject: {
    fullName: "Mary Smith",
    mobileNumber: "8765432109",
    dateOfBirth: "1975-08-22",
    landArea: "25.75",
    landOwnershipType: "Leased",
    primaryCropType: "Rice",
    secondaryCropType: "Pulses",
  },
  proof: {
    type: "Ed25519Signature2018",
    created: "2025-01-01T23:46:46Z",
    proofPurpose: "assertionMethod",
    verificationMethod: "did:web:vharsh.github.io:DID:local#key-0",
    jws: "eyJ4NXQjUzI1NiI6IkhkakdicHlseVY0ZGZPZS01dDRhWGJOc3F2d1JDaExOeUxWczl2MEhqSjQiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdLCJraWQiOiIxSTZ1bVNrRDRNeWxXUmMtYWJCejIwY3hMcUVGTUp3aG9KdmhNM1ZGZ21jIiwiYWxnIjoiRWREU0EifQ..VAqXjgwvMZ-3TAUR6kW0snxqGdlycyP3cQCzdsl61CFulGlOrCpCV_KiqMrEsQ3-23Cmn-pdtnF8m4V-qwkKAg",
  },
};

export const STATIC_JWT_VC = {
  "iss": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2Iiwia2lkIjoiMSIsIngiOiI0eE9mS3pXNl96S018M04xOVM1eE1hVldreDVSR3A1YURSVmJXcHBiRzF1VG5reFYiLCJ5IjoiaVpXVk5qWmxWdlZWVmJlRWRxV0hWemVIaFNVVkpYVzFsd01XMXdjM0J2YlZSIn0",
  "sub": "did:example:holder456",
  "jti": "urn:uuid:3c67f42e-dd3c-4d9b-898a-debff416ccca",
  "iat": 1767225600,
  "nbf": 1767225600,
  "exp": 1893456000,
  "vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": ["VerifiableCredential", "EmployeeCredential"],
    "credentialSubject": {
      "id": "did:example:holder456",
      "employeeId": "E12345",
      "name": "Anup Kumar",
      "role": "Software Engineer"
    }
  }
};