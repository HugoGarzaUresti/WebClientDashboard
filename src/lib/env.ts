const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "AWS_REGION",
  "AWS_S3_BUCKET",
] as const;

export function getEnv() {
  return requiredEnvVars.reduce<Record<string, string>>((acc, key) => {
    acc[key] = process.env[key] ?? "";
    return acc;
  }, {});
}
