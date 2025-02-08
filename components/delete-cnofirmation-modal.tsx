import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCurrentUser } from "@/store/slices/userSlice";
import { Spinner } from "./ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  userId,
}: DeleteConfirmationModalProps) {
  const router = useRouter();
  const { loading, isEvent, error, status } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleDelete = () => {
    dispatch(deleteCurrentUser({ id: userId }))
      .unwrap()
      .then(() => {
        onClose();
        toast({
          duration: 3000,
          className: "sm:w-[380px] w-[200px] bg-white rounded-[8px] border-none p-0 flex items-center justify-center",
          description: (
            <div className="flex flex-col items-center justify-center p-3 w-full">
              <CheckCircle2 className="w-16 h-16 text-[#14ae5c] mb-4" />
              <p className="text-xl font-semibold text-center w-full">Employee deleted successfully</p>
            </div>
          ),
        });
        router.replace("/dashboard/employees");
      })
      .catch(() => {
        onClose();
        toast({
          duration: 3000,
          className: "sm:w-[380px] w-[200px] bg-white rounded-[8px] border-none p-0 flex items-center justify-center",
          description: (
            <div className="flex flex-col items-center justify-center p-3 w-full">
              <AlertCircle className="h-10 w-10 text-[#ec221f]" />
              <p className="text-xl font-semibold text-center w-full">{error || "Failed to delete employee"}</p>
            </div>
          ),
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-[8px] mt-1 border-color-gray-250">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Delete Employee
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-center text-gray-600">
            Are you sure you want to delete this employee? This action cannot
            be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={handleDelete}
            className="bg-[#ff0000] hover:bg-[#ff0000]/90 text-white px-8 rounded-[8px] mt-1 border-color-gray-250"
          >
            {!isEvent ? "Delete" : "Deleting... "} {isEvent && <Spinner />}
          </Button>
          <Button
            onClick={onClose}
            className="bg-[#0066ff] hover:bg-[#0066ff]/90 text-white px-8 rounded-[8px] mt-1 border-color-gray-250"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
