import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:w-[380px] w-[200px] bg-white rounded-[8px]">
        <div className="flex flex-col items-center justify-center p-3">
          <CheckCircle2 className="w-16 h-16 text-[#14ae5c] mb-4" />
          <p className="text-xl font-semibold text-center">
            A new account have created
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
