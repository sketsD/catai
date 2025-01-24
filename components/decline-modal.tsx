"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function DeclineModal({
  isOpen,
  onClose,
  onConfirm,
}: DeclineModalProps) {
  const [reason, setReason] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-[8px]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fee9e7]">
            <AlertCircle className="h-10 w-10 text-[#ec221f]" />
          </div>

          <DialogHeader className="mt-4">
            <DialogTitle className="text-2xl font-semibold">
              Withdraw request
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 w-full space-y-4">
            <div className="text-center">
              <p>
                What is the reason for withdrawing the medication information
                edit request?
              </p>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="notes" className="w-full flex">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Enter your reason here..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px] rounded-[8px] mt-1 border-color-gray-250"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-[8px] mt-1 border-color-gray-250 bg-color-red-danger text-white hover:bg-red-600 hover:text-white"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-logoblue hover:bg-[#0165fc]/90 rounded-[8px] mt-1 border-color-gray-250 text-white"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
