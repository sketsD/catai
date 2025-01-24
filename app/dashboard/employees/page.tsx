"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Filter, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { CreateAccountModal } from "@/components/create-account-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SortIcon from "@/components/SortIcon";
import { FilterSelect } from "@/components/filter-select";

// Mock data - in real app would come from API
const employees = [
  {
    id: "123456789",
    name: "Serge",
    surname: "Stone",
    email: "stone@mail.com",
    department: "Department",
    type: "Pharmacy",
  },
  {
    id: "143567935",
    name: "John",
    surname: "Doe",
    email: "john@mail.com",
    department: "Department",
    type: "Technical",
  },
  {
    id: "724174536",
    name: "Jane",
    surname: "Smith",
    email: "jane@mail.com",
    department: "Department",
    type: "Admin",
  },
  {
    id: "912536735",
    name: "Mike",
    surname: "Johnson",
    email: "mike@mail.com",
    department: "Department",
    type: "Technical",
  },
];

const getBadgeColor = (type: string) => {
  switch (type) {
    case "Pharmacy":
      return "bg-blue-500 hover:bg-blue-500";
    case "Technical":
      return "bg-purple-500 hover:bg-purple-500";
    case "Admin":
      return "bg-yellow-500 hover:bg-yellow-500";
    default:
      return "bg-gray-500 hover:bg-gray-500";
  }
};

export default function EmployeesPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter employees based on search query
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    all: true,
    pharmacy: false,
    technical: false,
    admin: false,
  });

  const filteredAndSortedEmployees = useMemo(() => {
    return employees
      .filter((employee) => {
        const matchesSearch =
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType =
          filters.all ||
          filters[employee.type.toLowerCase() as keyof typeof filters];
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.id.localeCompare(b.id);
        } else {
          return b.id.localeCompare(a.id);
        }
      });
  }, [searchQuery, filters, sortOrder]);

  return (
    <div className=" bg-color-gray-200 p-2 sm:p-6 relative">
      <div className="overflow-hidden">
        <div className="">
          <div className="flex flex-col p-2 sm:p-6 min-h-[calc(100vh-3rem)] overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-b-[8px] rounded-tr-[8px] ">
            <div className="">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center text-logoblue hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
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
                <FilterSelect onFilterChange={setFilters} />
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
                        onClick={() => setSortOrder("asc")}
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
                        onClick={() => setSortOrder("desc")}
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
              <div className="hidden sm:grid sm:grid-cols-[1fr,100px,100px] items-center gap-4 p-4">
                <div className="font-medium text-color-gray-400">ID</div>
                <div className="font-medium text-center text-color-gray-400">
                  Department
                </div>
                <div className="font-medium text-center text-color-gray-400">
                  User type
                </div>
              </div>

              {filteredAndSortedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="border-[1px] border-color-gray-250 mb-4 rounded-[8px]"
                >
                  <Link
                    href={`/dashboard/employees/${employee.id}`}
                    className="flex flex-wrap sm:grid grid-cols-[minmax(0,1fr),100px,100px] items-center gap-4 p-3 hover:bg-gray-50 rounded-[8px] cursor-pointer "
                  >
                    <div className="truncate">
                      {employee.id}
                      {user?.id === employee.id && " (You)"}
                    </div>
                    <div className="text-center">{employee.department}</div>
                    <div className="flex justify-center">
                      <Badge
                        className={`${getBadgeColor(
                          employee.type
                        )} text-white whitespace-nowrap py-2`}
                      >
                        {employee.type}
                      </Badge>
                    </div>
                  </Link>
                </div>
              ))}
              {filteredAndSortedEmployees.length === 0 && (
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
