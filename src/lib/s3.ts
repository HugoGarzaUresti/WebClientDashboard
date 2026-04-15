import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";

const region =
  process.env.SUPABASE_S3_REGION ??
  process.env.AWS_REGION ??
  process.env.AWS_DEFAULT_REGION;

const endpoint = process.env.SUPABASE_S3_ENDPOINT ?? process.env.AWS_ENDPOINT_URL_S3;
const accessKeyId =
  process.env.SUPABASE_S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey =
  process.env.SUPABASE_S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;

const s3Config: S3ClientConfig = {
  region,
};

if (endpoint) {
  s3Config.endpoint = endpoint;
  s3Config.forcePathStyle = true;
}

if (accessKeyId && secretAccessKey) {
  s3Config.credentials = {
    accessKeyId,
    secretAccessKey,
  };
}

export const s3 = new S3Client(s3Config);

export function getStorageBucket() {
  const bucket =
    process.env.SUPABASE_S3_BUCKET ??
    process.env.S3_BUCKET ??
    process.env.AWS_S3_BUCKET;

  if (!bucket) {
    throw new Error(
      "Missing storage bucket configuration. Set SUPABASE_S3_BUCKET.",
    );
  }

  return bucket;
}
