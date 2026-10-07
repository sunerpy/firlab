#!/usr/bin/env node
// Prints ADMIN_PASSWORD_HASH for a password read from stdin (never from the command line):
//   node scripts/admin-password.mjs < password.txt
// The stored form is pbkdf2-sha256$<iterations>$<salt>$<hash>; functions/_lib/crypto.ts checks it.
import { webcrypto } from "node:crypto";

const ITERATIONS = 10_000;
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const password = Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
if (password.length < 16) {
  console.error("the password must be at least 16 characters");
  process.exit(1);
}
const b64 = (bytes) => Buffer.from(bytes).toString("base64url");
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const key = await webcrypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
const bits = await webcrypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256);
process.stdout.write(`pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(bits)}\n`);
