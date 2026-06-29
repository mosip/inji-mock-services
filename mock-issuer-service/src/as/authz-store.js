import crypto from "crypto";

export const authCodeStore = new Map();
export const accessTokenStore = new Map();
export const preAuthCodeStore = new Map();
export const parRequestStore = new Map();
// login_txn -> server-trusted authorization-request params (so the login form can't be tampered with)
export const loginTransactionStore = new Map();

export function generateAuthCode() {
  return crypto.randomBytes(16).toString("hex");
}

export function generateAccessToken() {
  return crypto.randomBytes(16).toString("hex");
}
