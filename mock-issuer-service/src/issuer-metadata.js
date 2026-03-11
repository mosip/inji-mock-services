export const ISSUER = "https://e4845fb4e9e7.ngrok-free.app";

export default function issuerMetadata(req, res) {
  res.json({
    credential_issuer: ISSUER,

    authorization_servers: [
      `${ISSUER}/as`
    ],

    credential_endpoint: `${ISSUER}/credential`,

    credential_configurations_supported: {
      "UniversityDegreeCredential": {
        format: "ldp_vc",
        scope: "degree.read",
        cryptographic_binding_methods_supported: ["jwk"],
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["RS256"]
          }
        },
        credential_definition: {
            type: ["VerifiableCredential", "UniversityDegreeCredential"],
            context: [
              "https://www.w3.org/2018/credentials/v1",
              
            ]
        }
      },
      "JwtVerifiableCredential": {
        format: "jwt_vc_json",
        scope: "jwt_vc_json.read",
        "display": [
          {
            name: "Employee Credential",
            locale: "en"
          },
          {
            name: "Kredensyal ng Empleyado",
            locale: "fil"
          },
          {
            name: "कर्मचारी क्रेडेंशियल",
            locale: "hi"
          },
          {
            name: "ಉದ್ಯೋಗಿ ರುಜುವಾತು",
            locale: "kn"
          },
          {
            name: "பணியாளர் நற்சான்றிதழ்",
            locale: "ta"
          },
          {
            name: "اعتماد الموظف",
            locale: "ar"
          }
      ],
        cryptographic_binding_methods_supported: ["did:jwk"],
        credential_signing_alg_values_supported: ["ES256"],
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["ES256", "RS256"]
          }
        },
        credential_definition: {
          type: ["VerifiableCredential", "EmployeeCredential"],
          credentialSubject: {
            "employeeId": {},
            "name": {},
            "role": {}
          }
        }
      }
    },

    grants: {
      authorization_code: {
        issuer_state: true
      },
    },
  });
}
