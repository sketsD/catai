"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { getPublicS3Url } from "@/utils/s3Utils";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  selectedImage: number | null;
  onImageChange: (index: number) => void;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  images,
  selectedImage,
  onImageChange,
}: ImagePreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && selectedImage !== null && images.length > 0) {
      setCurrentImageIndex(selectedImage);
      setLoading(true);
    }
  }, [isOpen, selectedImage, images]);

  const navigateImage = useCallback(
    (direction: number) => {
      if (!images.length) return;
      const newIndex =
        (currentImageIndex + direction + images.length) % images.length;
      setCurrentImageIndex(newIndex);
      onImageChange(newIndex);
      setLoading(true);
    },
    [currentImageIndex, images, onImageChange]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (event.key === "ArrowRight") {
        navigateImage(1);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, navigateImage]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (!isOpen || selectedImage === null || !images?.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-white">
        <div className="relative w-full h-[90vh]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white/90 rounded-full border-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            className="z-50 absolute top-1/2 left-2 rounded-full border-2 w-12 h-12 bg-logoblue text-white hover:bg-blue-700"
            onClick={() => navigateImage(-1)}
          >
            <ArrowLeft />
          </Button>
          <div className="w-full h-full relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Spinner />
              </div>
            )}
            <Image
              key={currentImageIndex}
              src={
                getPublicS3Url(images[currentImageIndex]) || "/placeholder.svg"
              }
              alt={`Image ${currentImageIndex + 1} of ${images.length}`}
              fill
              className="object-contain"
              quality={100}
              onLoad={handleImageLoad}
              priority
            />
          </div>
          <Button
            className="z-50 absolute top-1/2 right-2 rounded-full border-2 w-12 h-12 bg-logoblue text-white hover:bg-blue-700"
            onClick={() => navigateImage(1)}
          >
            <ArrowRight />
          </Button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
