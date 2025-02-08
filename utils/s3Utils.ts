/**
 * Converts an S3 URL to a public accessible URL
 * Example input: s3://pharmacy-sheba/new-uploads/new-images/image.jpg
 * Example output: https://pharmacy-sheba.s3.eu-central-1.amazonaws.com/new-uploads/new-images/image.jpg
 */
export function getPublicS3Url(s3Url: string): string {
  if (!s3Url) return "/placeholder.svg";
  
  try {
    // Remove s3:// prefix and split into bucket and key
    const withoutProtocol = s3Url.replace("s3://", "");
    const [bucket, ...keyParts] = withoutProtocol.split("/");
    const key = keyParts.join("/");
    
    // Construct the public URL using the public environment variable
    return `https://${bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error converting S3 URL:", error);
    return "/placeholder.svg";
  }
} 