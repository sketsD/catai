import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: string;
}

export function FailedModal({ isOpen, onClose, error }: SuccessModalProps) {
  const errorMessage = error === "" ? "Something went wrong" : error;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:w-[380px] w-[200px] bg-white rounded-[8px]">
        <div className="flex flex-col items-center justify-center p-3">
          <AlertCircle className="h-10 w-10 text-[#ec221f]" />
          <p className="text-xl font-semibold text-center">{errorMessage}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
