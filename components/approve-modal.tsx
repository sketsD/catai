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
      <DialogContent className="!p-0 !bg-white sm:max-w-[440px] rounded-[8px] border-color-gray-250 data-[state=open]:!bg-white">
        <div className="flex flex-col items-center text-center p-6 bg-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ebffee]">
            <Check className="h-10 w-10 text-[#14ae5c]" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">
            Medicine successfully approved
          </h2>
        </div>
      </DialogContent>
    </Dialog>
  );
}
