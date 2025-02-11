import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;

export async function getSignedS3Url(objectKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export function getObjectKeyFromS3Url(s3Url: string): string {
  return s3Url.replace(`s3://${BUCKET_NAME}/`, "");
}
