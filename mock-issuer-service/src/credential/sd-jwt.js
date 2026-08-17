import { SignJWT, exportPKCS8 } from 'jose';
import { randomBytes, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function base64url(buffer) {
  return buffer.toString('base64url');
}

function sha256(data) {
  return createHash('sha256').update(data).digest();
}

async function selfSignedCertB64(privateKey) {
  const pkcs8 = await exportPKCS8(privateKey);
  const dir = mkdtempSync(join(tmpdir(), 'sdjwt-cert-'));
  const keyPath = join(dir, 'key.pem');
  try {
    writeFileSync(keyPath, pkcs8, { mode: 0o600 });
    const der = execFileSync(
      'openssl',
      ['req', '-x509', '-key', keyPath,
       '-subj', '/CN=INJI Mock Issuer/O=INJI Mock Services',
       '-days', '365', '-outform', 'DER'],
      { maxBuffer: 1 << 20 },
    );
    return der.toString('base64');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export async function createSdJwt(payload, privateKey, issuer, holderDid) {
  const disclosures = [];
  const sdHashes = [];

  const claimsToDisclose = Object.keys(payload).filter(k => k !== 'iss' && k !== 'sub' && k !== 'iat' && k !== 'exp' && k !== 'nbf' && k !== 'jti' && k !== 'vct' && k !== 'cnf');

  const newPayload = { ...payload };

  for (const claim of claimsToDisclose) {
    const salt = base64url(randomBytes(16));
    const disclosureArray = [salt, claim, payload[claim]];
    const disclosureJson = JSON.stringify(disclosureArray);
    const disclosureB64 = Buffer.from(disclosureJson).toString('base64url');
    disclosures.push(disclosureB64);

    const hash = base64url(sha256(disclosureB64));
    sdHashes.push(hash);
    delete newPayload[claim];
  }

  newPayload._sd = sdHashes.sort();
  newPayload._sd_alg = 'sha-256';
  newPayload.keyName = "Simon"
  newPayload.residence = "Bangalore";

  const x5c = [await selfSignedCertB64(privateKey)];

  const jwt = await new SignJWT(newPayload)
    .setProtectedHeader({ alg: 'ES256', typ: 'vc+sd-jwt', kid: issuer, x5c })
    .setIssuedAt()
    .setIssuer(issuer)
    .setSubject(holderDid)
    .setExpirationTime('1y')
    .sign(privateKey);

  return jwt + '~' + disclosures.join('~') + '~';
}
