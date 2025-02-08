import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
}: ImagePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-[90vh]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white/90 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-full h-full relative">
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 