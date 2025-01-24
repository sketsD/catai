"use client";

import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApproveModal({ isOpen, onClose }: ApproveModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-white rounded-[8px] border-color-gray-250">
        <div className="flex flex-col items-center text-center p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ebffee]">
            <Check className="h-10 w-10 text-[#14ae5c]" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">
            You have successfully approved the request
          </h2>
        </div>
      </DialogContent>
    </Dialog>
  );
}
