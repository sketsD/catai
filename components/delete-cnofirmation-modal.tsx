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
import { SuccessModal } from "./success-modal";
import { FailedModal } from "./FailedModal";
import { Spinner } from "./ui/spinner";
// import { SuccessModal } from "./SuccessModal";
// import { ErrorModal } from "./ErrorModal";

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
  const { loading, isEvent, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = () => {
    dispatch(deleteCurrentUser({ id: userId }))
      .unwrap()
      .then(() => {
        onClose();
        setShowSuccessModal(true);
      })
      .catch(() => {
        onClose();
        setErrorMessage(
          error || "An error occurred while deleting the employee."
        );
        setShowErrorModal(true);
      });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/dashboard/employees");
  };

  return (
    <>
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

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message="Employee deleted"
      />

      <FailedModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={errorMessage}
      />
    </>
  );
}
