import * as cbor from 'cbor-x';
import * as cose from 'cose-js';
import { createHash, randomBytes } from 'node:crypto';

const standardCbor = new cbor.Encoder({
  useRecords: false,
  useTag259ForMaps: false,
  variableMapSize: true,
});

function sha256(data) {
  return createHash('sha256').update(data).digest();
}

function taggedDateTime(date) {
  return new cbor.Tag(date.toISOString(), 0);
}

function toCoseKey(publicKeyJwk) {
  return new Map([
    [1, 2], // kty: EC2
    [-1, 1], // crv: P-256
    [-2, Buffer.from(publicKeyJwk.x, 'base64url')],
    [-3, Buffer.from(publicKeyJwk.y, 'base64url')],
  ]);
}

function normalizeCoseHeaderMap(header) {
  if (!header || header instanceof Map) {
    return header;
  }

  return new Map(
    Object.entries(header).map(([key, value]) => {
      const numericKey = Number(key);
      return [Number.isNaN(numericKey) ? key : numericKey, value];
    }),
  );
}

export async function createMdoc(privateKeyJwk, publicKeyJwk, docType, namespaces) {
  const issuerSigned = {
    nameSpaces: {},
    issuerAuth: null
  };

  const valueDigests = {};

  for (const ns of Object.keys(namespaces)) {
    issuerSigned.nameSpaces[ns] = [];
    valueDigests[ns] = new Map();
    
    const nsClaims = namespaces[ns];
    let digestId = 0;
    
    for (const claim of Object.keys(nsClaims)) {
      const salt = randomBytes(16);
      
      const item = {
        digestID: digestId,
        random: salt,
        elementIdentifier: claim,
        elementValue: nsClaims[claim]
      };
      
      const encodedItem = standardCbor.encode(item);
      const taggedItem = new cbor.Tag(encodedItem, 24);
      issuerSigned.nameSpaces[ns].push(taggedItem);
      
      const digest = sha256(standardCbor.encode(taggedItem));
      valueDigests[ns].set(digestId, digest);
      
      digestId++;
    }
  }

  const mso = {
    version: "1.0",
    digestAlgorithm: "SHA-256",
    valueDigests: valueDigests,
    deviceKeyInfo: {
      deviceKey: toCoseKey(publicKeyJwk)
    },
    docType: docType,
    validityInfo: {
      signed: taggedDateTime(new Date()),
      validFrom: taggedDateTime(new Date()),
      validUntil: taggedDateTime(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
    }
  };

  const msoCbor = standardCbor.encode(new cbor.Tag(standardCbor.encode(mso), 24));
  
  // Sign MSO with COSE
  const signer = {
    key: {
      d: Buffer.from(privateKeyJwk.d, 'base64url'),
      x: Buffer.from(privateKeyJwk.x, 'base64url'),
      y: Buffer.from(privateKeyJwk.y, 'base64url')
    }
  };
  
  // For COSE_Sign1:
  // headers.p contains protected headers
  // headers.u contains unprotected headers
  // signers is a single signer object
  const headers = {
    p: { alg: 'ES256' },
    u: { kid: privateKeyJwk.kid }
  };
  
  try {
    // In cose-js 0.9.0, exports.create(headers, payload, signers, options)
    // If signers is NOT an array, it creates a COSE_Sign1.
    const signature = await cose.sign.create(headers, msoCbor, signer);
    const decodedSignature = cbor.decode(signature);
    if (decodedSignature?.tag === 18) {
      const sign1 = decodedSignature.value;
      sign1[1] = normalizeCoseHeaderMap(sign1[1]);
      issuerSigned.issuerAuth = standardCbor.encode(sign1);
    } else {
      issuerSigned.issuerAuth = signature;
    }
  } catch (err) {
    console.error("COSE signing failed:", err);
    throw err;
  }

  const mdoc = {
    docType: docType,
    issuerSigned: issuerSigned
  };

  return standardCbor.encode(mdoc);
}
