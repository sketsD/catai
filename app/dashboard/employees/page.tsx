"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateAccountModal } from "@/components/create-account-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SortIcon from "@/components/ui/SortIcon";
import { FilterSelect, FilterStateUsers } from "@/components/filter-select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Spinner } from "@/components/ui/spinner";
import {
  getAllUsers,
  clearError,
  selectFilteredUsers,
} from "@/store/slices/userSlice";
import { isRole } from "@/utils/helpers";
import { useRouter } from "next/navigation";
// import { getBadgeColor } from "@/utils/helpers";
export const getBadgeColor = (role: string) => {
  switch (role) {
    case "pharm":
      return "bg-blue-500 hover:bg-blue-500";
    case "tech":
      return "bg-purple-500 hover:bg-purple-500";
    case "admin":
      return "bg-yellow-500 hover:bg-yellow-500";
    default:
      return "bg-gray-500 hover:bg-gray-500";
  }
};

export default function EmployeesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<FilterStateUsers>({
    all: true,
    pharm: false,
    tech: false,
    admin: false,
  });
  const dispatch = useAppDispatch();
  const { userid } = useAppSelector((state) => state.auth);
  const { users, loading, error, status } = useAppSelector(
    (state) => state.user
  );
  const router = useRouter();

  const filteredUsers = useAppSelector((state) =>
    selectFilteredUsers(state, filters, searchQuery, sortOrder)
  );
  useEffect(() => {
    if (!loading) {
      dispatch(getAllUsers());
    }
    return () => {
      dispatch(clearError());
    };
  }, []);

  useEffect(() => {
    console.log(
      "[Users] State update - loading:",
      loading,
      "status:",
      status,
      "error:",
      error
    );
    console.log("[Users] Filtered users count:", filteredUsers.length);
  }, [loading, status, error, filteredUsers]);
  // Filter employees based on search query

  const handleFilter = (filterState: FilterStateUsers) => {
    console.log("[Users] Applying filters:", filterState);
    setFilters(filterState);
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    console.log("[Users] Changing sort order to:", order);
    setSortOrder(order);
  };

  if (loading)
    return (
      <div className=" w-full min-h-[calc(100vh-3rem)] flex items-center justify-center bg-color-gray-200">
        <Spinner />
      </div>
    );
  return (
    <div className=" bg-color-gray-200 p-2 sm:p-6 relative">
      <div className="overflow-hidden">
        <div className="">
          <div className="flex flex-col p-2 sm:p-6 min-h-[calc(100vh-3rem)] overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-b-[8px] rounded-tr-[8px] ">
            <div className="">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-logoblue hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </div>
            <div className="flex flex-col lg:flex-row justify-between justify-startlg: items-start lg:items-center gap-4">
              <h1 className="text-2xl font-semibold text-nowrap">
                Employee List
              </h1>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto mb-2 sm:mb-0">
                <Input
                  type="search"
                  placeholder="Search"
                  className="flex-grow sm:flex-grow-0 lg:w-96 rounded-[8px] border-color-gray-250 placeholder:text-color-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FilterSelect onFilterChange={handleFilter} />
                <Popover>
                  <PopoverTrigger asChild className="border-0 w-24">
                    <Button className="p-0 text-lg rounded-[8px] hover:bg-color-gray-200">
                      <SortIcon />
                      <span className="text-logoblue">Sort</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40" align="end">
                    <div className="grid gap-1">
                      <Button
                        variant="ghost"
                        className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                          sortOrder === "asc"
                            ? "text-logoblue bg-color-gray-200"
                            : "hover:text-logoblue"
                        }`}
                        onClick={() => handleSortOrderChange("asc")}
                      >
                        Ascending
                      </Button>
                      <Button
                        variant="ghost"
                        className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                          sortOrder === "desc"
                            ? "text-logoblue bg-color-gray-200"
                            : "hover:text-logoblue"
                        }`}
                        onClick={() => handleSortOrderChange("desc")}
                      >
                        Descending
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  className="text-white px-8 rounded-[8px] bg-logoblue hover:bg-blue-700 whitespace-nowrap hidden sm:block "
                  onClick={() => setShowCreateModal(true)}
                >
                  Create New
                </Button>
              </div>
            </div>

            <div className="">
              <div className="hidden sm:grid sm:grid-cols-[1fr,100px] items-center gap-4 p-4">
                <div className="font-medium text-color-gray-400">
                  ID / Full Name
                </div>
                <div className="font-medium text-color-gray-400 text-right">
                  User type
                </div>
              </div>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="border-[1px] border-color-gray-250 mb-4 rounded-[8px]"
                >
                  <Link
                    href={
                      userid === user.id
                        ? "/dashboard/profile"
                        : `/dashboard/employees/${user.id}`
                    }
                    className="flex flex-wrap sm:grid grid-cols-[minmax(0,1fr),100px] items-center gap-4 p-3 hover:bg-gray-50 rounded-[8px] cursor-pointer "
                  >
                    <div>
                      <div className="truncate text-gray-600 text-sm">
                        {user.id}
                      </div>
                      <div className="truncate font-medium">
                        {user.firstname} {user.surname}
                        {userid === user.id && " (You)"}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Badge
                        className={`${getBadgeColor(
                          user.role
                        )} text-white whitespace-nowrap py-2`}
                      >
                        {isRole(user.role)}
                      </Badge>
                    </div>
                  </Link>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No employees found
                </div>
              )}
            </div>
          </div>
          <CreateAccountModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        </div>
      </div>
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed sm:hidden w-14 h-14 rounded-[100%] bg-logoblue hover:bg-blue-700 text-white text-2xl bottom-3 right-3"
      >
        +
      </button>
    </div>
  );
}
