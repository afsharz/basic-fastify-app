import { randomBytes, pbkdf2Sync } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function verifyPassword({
  condidatePassword,
  salt,
  hash,
}: {
  condidatePassword: string;
  salt: string;
  hash: string;
}) {
  const condidateHash = pbkdf2Sync(
    condidatePassword,
    salt,
    1000,
    64,
    "sha512"
  ).toString("hex");

  return condidateHash === hash;
}
