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

export const STATIC_JWT_VC = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkaWQ6ZXhhbXBsZTppc3N1ZXIiLCJzdWIiOiJkaWQ6ZXhhbXBsZTp1c2VyIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkp3dFZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Im5hbWUiOiJNb2NrIFVzZXIiLCJiaXJ0aERhdGUiOiIyMDAwLTAxLTAxIn19LCJqdGkiOiJtb2NrLWlkLTEyMyIsImlhdCI6MTYxNTg5MTQyMiwiZXhwIjoxOTE1ODkxNDIyfQ.mock_signature_for_download_test";