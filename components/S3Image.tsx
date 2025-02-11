"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getSignedS3Url, getObjectKeyFromS3Url } from "../utils/s3Client";

interface S3ImageProps {
  s3Url: string;
  alt: string;
  width: number;
  height: number;
}

const S3Image: React.FC<S3ImageProps> = ({ s3Url, alt, width, height }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const objectKey = getObjectKeyFromS3Url(s3Url);
        const url = await getSignedS3Url(objectKey);
        setImageUrl(url);
      } catch (err) {
        console.error("Failed to load image:", err);
        setError("Failed to load image");
      }
    };

    loadImage();
  }, [s3Url]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px]">
      {imageUrl ? (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          layout="responsive"
        />
      ) : (
        <Image
          src={"/placeholder.svg"}
          alt={`Medicine`}
          fill
          className="object-cover"
        />
      )}
    </div>
  );
};

export default S3Image;
