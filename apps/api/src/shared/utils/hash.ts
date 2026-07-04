import crypto from "crypto";

export function generateJobHash(
  title: string,
  company: string,
  applyUrl: string,
) {
  return crypto
    .createHash("sha256")
    .update(`${title}-${company}-${applyUrl}`.toLowerCase())
    .digest("hex");
}
