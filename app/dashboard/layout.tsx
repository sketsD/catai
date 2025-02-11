"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import EmployeeList from "@/components/ui/EmployeeList";
import Profile from "@/components/ui/Profile";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link
        href="/dashboard/employees"
        className="text-white hover:text-gray-200 flex items-center gap-2"
      >
        <EmployeeList />
        Employee List
      </Link>
      <Link
        href="/dashboard/profile"
        className="text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Profile />
        Profile
      </Link>
    </>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <header>
          <Navbar>
            <div className="hidden md:flex md:items-center md:gap-6">
              <NavItems />
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu strokeWidth={2} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-color-gray-950"
              >
                <div className="flex flex-col gap-4 mt-8">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </Navbar>
        </header>
        <main className="pt-16 flex-1 bg-[#f5f5f5]">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
