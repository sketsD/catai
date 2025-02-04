"use client";

import { useState, useEffect } from "react";
import { SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterDialog, type FilterState } from "@/components/filter-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import SortIcon from "@/components/SortIcon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllMedicine } from "@/store/slices/medicineSlice";

// Mock data - would come from API in real app
const waitingMedicines = [
  {
    id: "1",
    name: "Cefotaxime Medo",
    date: "20/10/24",
    groupType: "Pharmacy",
    status: "Pending",
  },
  {
    id: "2",
    name: "Ibuprofen",
    date: "20/10/24",
    groupType: "Technical",
    status: "Pending",
  },
  {
    id: "3",
    name: "Paracetamol",
    date: "20/10/24",
    groupType: "Technical",
    status: "Pending",
  },
  {
    id: "4",
    name: "Metformin",
    date: "19/10/24",
    groupType: "Pharmacy",
    status: "Pending",
  },
  {
    id: "5",
    name: "Omeprazole",
    date: "18/10/24",
    groupType: "Pharmacy",
    status: "Pending",
  },
  {
    id: "6",
    name: "Doxycycline",
    date: "17/10/24",
    groupType: "Technical",
    status: "Pending",
  },
  {
    id: "7",
    name: "Amoxicillin",
    date: "20/10/24",
    groupType: "Pharmacy",
    status: "Pending",
  },
  {
    id: "8",
    name: "Aspirin",
    date: "20/10/24",
    groupType: "Technical",
    status: "Pending",
  },
  {
    id: "9",
    name: "Lisinopril",
    date: "19/10/24",
    groupType: "Pharmacy",
    status: "Pending",
  },
  {
    id: "10",
    name: "Simvastatin",
    date: "19/10/24",
    groupType: "Technical",
    status: "Pending",
  },
];

const certifiedMedicines = [
  {
    id: "1",
    name: "Cefotaxime Medo",
    date: "20/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "2",
    name: "Ibuprofen",
    date: "20/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "3",
    name: "Paracetamol",
    date: "20/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "4",
    name: "Metformin",
    date: "19/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "5",
    name: "Omeprazole",
    date: "18/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "6",
    name: "Doxycycline",
    date: "17/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "7",
    name: "Amoxicillin",
    date: "20/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "8",
    name: "Aspirin",
    date: "20/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "9",
    name: "Lisinopril",
    date: "19/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "10",
    name: "Simvastatin",
    date: "19/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "11",
    name: "Metoprolol",
    date: "18/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "12",
    name: "Amlodipine",
    date: "18/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "13",
    name: "Gabapentin",
    date: "17/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
  {
    id: "14",
    name: "Sertraline",
    date: "17/10/24",
    groupType: "Technical",
    status: "Approved",
  },
  {
    id: "15",
    name: "Fluoxetine",
    date: "16/10/24",
    groupType: "Pharmacy",
    status: "Approved",
  },
];

const getGroupTypeBadgeColor = (type: string) => {
  switch (type) {
    case "Pharmacy":
      return "bg-[#0066ff] hover:bg-[#0066ff]";
    case "Technical":
      return "bg-[#9747ff] hover:bg-[#9747ff]";
    default:
      return "bg-gray-500 hover:bg-gray-500";
  }
};

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-[#cff7d3] text-[#14ae5c] border-[#cff7d3]";
    case "pending":
      return "bg-[#fdd3d0] text-[#ec221f] border-[#fdd3d0]";
    case "decline":
      return "bg-[#ddc3ff] text-[#7307ff] border-[#ddc3ff]";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("waiting");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    groupType: {
      all: true,
      technical: false,
      pharmacy: false,
    },
    date: {
      oneDay: true,
      threeWeeks: false,
    },
  });
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const { medicines: allMedicnes } = useAppSelector((state) => state.medicine);
  const dispatch = useAppDispatch();
  const waitingMedicines = allMedicnes.filter(
    (medicine) => medicine.status === "pending"
  );
  const certifiedMedicines = allMedicnes.filter(
    (medicine) => medicine.status !== "pending"
  );
  const medicines =
    activeTab === "waiting" ? waitingMedicines : certifiedMedicines;
  // const {medicines} =
  useEffect(() => {
    dispatch(getAllMedicine());
  }, []);

  // Filter and sort medicines
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Apply group type filter
    const matchesGroupType =
      filters.groupType.all ||
      (filters.groupType.technical && medicine.category === "technical") ||
      (filters.groupType.pharmacy && medicine.category === "pharmacy");

    // Apply date filter (simplified for demo)
    // const matchesDate = filters.date.oneDay
    //   ? medicine.date >= "20/10/24"
    //   : medicine.date < "20/10/24";

    return matchesSearch && matchesGroupType;
    // return matchesSearch && matchesGroupType && matchesDate;
  });
  // .sort((a, b) => {
  //   if (sortOrder === "new") {
  //     return b.date.localeCompare(a.date);
  //   }
  //   return a.date.localeCompare(b.date);
  // });

  return (
    <div className="min-h-screen bg-color-gray-200 p-2 sm:p-6">
      <div className="overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-color-gray-200"
        >
          <TabsList className="">
            <TabsTrigger value="waiting" className="px-0 py-0">
              <div
                className={`w-full bg-white px-4 py-2 ${
                  activeTab === "waiting"
                    ? "text-logoblue"
                    : "text-color-gray-400"
                }`}
              >
                Waiting List
              </div>
            </TabsTrigger>
            <div className="sm:w-[1px] w-[2px] h-full bg-color-gray-250"></div>
            <TabsTrigger value="certified" className="px-0 py-0">
              <div
                className={`w-full bg-white px-4 py-2 ${
                  activeTab === "certified"
                    ? "text-logoblue"
                    : "text-color-gray-400"
                }`}
              >
                Certified List
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-6 p-2 sm:p-6 min-h-[calc(100vh-6rem)] overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-b-[8px] sm:rounded-tr-[8px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl font-semibold text-nowrap">
                {activeTab === "waiting" ? "Waiting List" : "Certified List"}
              </h1>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto mb-2 sm:mb-0">
                <Input
                  type="search"
                  placeholder="Search"
                  className="flex-grow sm:flex-grow-0 sm:w-96 rounded-[8px] border-color-gray-250 placeholder:text-color-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FilterDialog onFilterChange={setFilters} />
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
                          sortOrder === "new"
                            ? "text-logoblue bg-color-gray-200"
                            : "hover:text-logoblue"
                        }`}
                        onClick={() => setSortOrder("new")}
                      >
                        First New
                      </Button>
                      <Button
                        variant="ghost"
                        className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                          sortOrder === "old"
                            ? "text-logoblue bg-color-gray-200"
                            : "hover:text-logoblue"
                        }`}
                        onClick={() => setSortOrder("old")}
                      >
                        First Old
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="">
              <div
                className={`hidden sm:grid ${
                  activeTab === "waiting"
                    ? "sm:grid-cols-[1fr,100px,120px,100px]"
                    : "sm:grid-cols-[1fr,100px,100px]"
                } items-center gap-4 p-4`}
              >
                <div className="font-medium text-color-gray-400">
                  Medicine Name
                </div>
                <div className="font-medium text-center text-color-gray-400">
                  Date
                </div>
                {activeTab === "waiting" && (
                  <div className="font-medium text-center text-color-gray-400">
                    Group Type
                  </div>
                )}
                <div className="font-medium text-center text-color-gray-400">
                  Status
                </div>
              </div>

              {filteredMedicines.map((medicine) => (
                <div
                  className="border-[1px] border-color-gray-250 mb-4 rounded-[8px]"
                  key={medicine.metadata_id}
                >
                  <Link
                    href={
                      medicine.status === "approved"
                        ? `/dashboard/medicines/certified/${medicine.metadata_id}`
                        : `/dashboard/medicines/${medicine.metadata_id}`
                    }
                    className={`flex flex-wrap sm:grid ${
                      activeTab === "waiting"
                        ? "grid-cols-[minmax(0,1fr),100px,120px,100px]"
                        : "grid-cols-[minmax(0,1fr),100px,100px]"
                    } items-center gap-4 p-3 hover:bg-gray-50 rounded-[8px] cursor-pointer`}
                  >
                    <div className="truncate">{medicine.product_name}</div>

                    <div className="text-center">27/09/2024</div>
                    {/* <div className="text-center">{medicine.date}</div> */}
                    {activeTab === "waiting" && (
                      <div className="flex justify-center">
                        <Badge
                          className={`${getGroupTypeBadgeColor(
                            medicine.category
                          )} text-white whitespace-nowrap py-2`}
                        >
                          {medicine.category}
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeStyle(
                          medicine.status
                        )} whitespace-nowrap py-2`}
                      >
                        {medicine.status}
                      </Badge>
                    </div>
                  </Link>
                </div>
              ))}
              {filteredMedicines.length === 0 && (
                <div className="p-4 text-center text-color-gray-400">
                  No medicines found
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
