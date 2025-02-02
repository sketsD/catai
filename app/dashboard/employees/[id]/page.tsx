"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Spinner } from "@/components/ui/spinner";
import { deleteCurrentUser, getCurrentUser } from "@/store/slices/userSlice";

export default function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const employee = getEmployee(params.id);

  const { status, error, currentUser, loading } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCurrentUser({ id: params.id }));
    console.log(currentUser);
  }, []);

  const handleDelete = () => {
    // Here you would delete the employee
    dispatch(deleteCurrentUser({ id: params.id }));
    setShowDeleteModal(false);
    router.push("/dashboard/employees");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-3rem)] bg-color-gray-200 p-2 sm:p-6">
        <Spinner />
      </div>
    );
  // if (currentUser === "" || error || status === "error") {
  //   <div className="flex items-center justify-center w-full min-h-[calc(100vh-3rem)] bg-color-gray-200 p-2 sm:p-6">
  //     Can't load user's data
  //   </div>;
  // }
  return (
    <div className="min-h-screen bg-color-gray-200 p-2 sm:p-6">
      <div className="flex flex-col gap-6 min-h-[calc(100vh-3rem)] overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-[8px]">
        <div className="p-6">
          <div className="">
            <Link
              href="/dashboard/employees"
              className="inline-flex items-center text-logoblue hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" color="#0165FC" />
              Back
            </Link>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              {currentUser.role} Profile #{currentUser.id}
            </h1>

            <Button
              className="md:block hidden bg-[#EC221F] w-28 text-white rounded-[8px] hover:bg-red-600"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>

          <div className="w-full xl:w-1/2 grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <Input
                    value={currentUser.firstname}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Surname</label>
                  <Input
                    value={currentUser.surname}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ID</label>
                  <Input
                    value={currentUser.id}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <Input
                    value={currentUser.role}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Department</label>
                  <Input
                    value={currentUser.department}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-4">Contact information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <Input
                    value={currentUser.email}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <Input
                    type="password"
                    value="••••••••••••"
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
              </div>
            </section>

            <Button
              className="w-full md:hidden bg-[#EC221F] text-white rounded-[8px] hover:bg-red-600"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="bg-white rounded-[8px] mt-1 border-color-gray-250">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                Delete Employee
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-center text-gray-600">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={handleDelete}
                className="bg-[#ff0000] hover:bg-[#ff0000]/90 text-white px-8 rounded-[8px] mt-1 border-color-gray-250"
              >
                Delete
              </Button>
              <Button
                onClick={() => setShowDeleteModal(false)}
                className="bg-[#0066ff] hover:bg-[#0066ff]/90 text-white px-8 rounded-[8px] mt-1 border-color-gray-250"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
