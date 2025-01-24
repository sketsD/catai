"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoutModal } from "@/components/logout-modal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
            <h1 className="text-2xl font-semibold">Profile</h1>
            <Button
              onClick={() => setShowLogoutModal(true)}
              className="hidden md:block rounded-[8px] bg-logoblue hover:bg-blue-700 text-white"
            >
              Log Off
            </Button>
          </div>
          <div className="w-full xl:w-1/2 grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <Input
                    value={user?.name}
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
                    value={user?.type}
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
                <Button className="rounded-[8px] w-full bg-logoblue hover:bg-blue-700 text-white">
                  Edit Contact information
                </Button>
                <Button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full md:hidden rounded-[8px] bg-logoblue hover:bg-blue-700 text-white"
                >
                  Log Off
                </Button>
              </div>
            </section>
          </div>

          <LogoutModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
          />
        </div>
      </div>
    </div>
  );
}
