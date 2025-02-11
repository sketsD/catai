"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoutModal } from "@/components/logout-modal";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, getCurrentUser } from "@/store/slices/userSlice";
import { Spinner } from "@/components/ui/spinner";
import { UpdateAccountModal } from "@/components/update-account-modal";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [showUpdateModal, setUpdateModal] = useState<boolean>(false);
  const {
    currentUser: user,
    status,
    error,
    loading,
    users,
    isEvent,
  } = useAppSelector((state) => state.user);
  const { userid } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userid) {
      console.log(status + " profile mount");
      dispatch(getCurrentUser({ id: userid }));
    }
    return () => {
      dispatch(clearError());
      console.log(status + " Profile unmount");
    };
  }, []);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  if (!user) {
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-3rem)] bg-color-gray-200 p-2 sm:p-6">
      No data found
    </div>;
  }
  if (loading && !isEvent)
    return (
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-3rem)] bg-color-gray-200 p-2 sm:p-6">
        <Spinner />
      </div>
    );
  return (
    <div className="min-h-screen bg-color-gray-200 p-2 sm:p-6">
      <div className="flex flex-col gap-6 min-h-[calc(100vh-3rem)] overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-[8px]">
        <div className="p-6">
          <div className="">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-logoblue hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" color="#0165FC" />
              Back
            </button>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <Button
              onClick={() => setShowLogoutModal(true)}
              className="hidden md:block rounded-[8px] bg-logoblue hover:bg-blue-700 text-white"
            >
              Log Out
            </Button>
          </div>
          <div className="w-full xl:w-1/2 grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <Input
                    value={user?.firstname}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Surname</label>
                  <Input
                    value={user?.surname}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ID</label>
                  <Input
                    value={user?.id}
                    readOnly
                    className="rounded-[8px] border-color-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <Input
                    value={user?.role}
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
                    value={user?.email}
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
                <Button
                  className="rounded-[8px] w-full bg-logoblue hover:bg-blue-700 text-white"
                  onClick={() => setUpdateModal(true)}
                >
                  Edit Contact information
                </Button>
                <Button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full md:hidden rounded-[8px] bg-logoblue hover:bg-blue-700 text-white"
                >
                  Log Out
                </Button>
              </div>
            </section>
          </div>

          <LogoutModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
          />

          <UpdateAccountModal
            isOpen={showUpdateModal}
            onClose={() => setUpdateModal(false)}
            id={user?.id || ""}
            email={user?.email || ""}
            firstname={user?.firstname || ""}
            surname={user?.surname || ""}
            role={user?.role || "pharm"}
          />
        </div>
      </div>
    </div>
  );
}
