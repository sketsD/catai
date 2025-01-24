"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg sm:w-[440px] rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-semibold">
            Log Out
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-center ">
            Are you sure you want to log out? You&apos;ll need to sign in again
            to access your account.
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={handleLogout}
            className="bg-color-red-danger hover:bg-red-600 text-white px-8 rounded-[8px]"
          >
            Log Off
          </Button>
          <Button
            onClick={onClose}
            className=" text-white px-8 rounded-[8px] bg-logoblue hover:bg-blue-700 "
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
