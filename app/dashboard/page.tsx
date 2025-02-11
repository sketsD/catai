"use client";

import { useState, useEffect, act } from "react";
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
import SortIcon from "@/components/ui/SortIcon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  getMedicineByStatus,
  getMedicineData,
  selectFilteredMedicines,
} from "@/store/slices/medicineSlice";
import { Spinner } from "@/components/ui/spinner";
import { format, formatDate, formatISO, parseISO } from "date-fns";
// import { getStatusBadgeStyle, getGroupTypeBadgeColor } from "@/utils/helpers";
export const getStatusBadgeStyle = (status: string) => {
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

export const getGroupTypeBadgeColor = (type: string) => {
  switch (type) {
    case "Pharmacy":
      return "bg-[#0066ff] hover:bg-[#0066ff]";
    case "Technical":
      return "bg-[#9747ff] hover:bg-[#9747ff]";
    default:
      return "bg-gray-500 hover:bg-gray-500";
  }
};

const getActiveTab = (statusTab: string) => {
  return statusTab === "waiting"
    ? "pending"
    : statusTab === "approved"
    ? "approved"
    : "completed";
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
  const { status, loading, error } = useAppSelector((state) => state.medicine);
  const filteredMedicines = useAppSelector((state) =>
    selectFilteredMedicines(state, filters, searchQuery, sortOrder)
  );
  const dispatch = useAppDispatch();

  const handleFilter = (filterState: FilterState) => {
    console.log("[Dashboard] Applying filters:", filterState);
    setFilters(filterState);
  };

  const handleSortOrderChange = (order: "new" | "old") => {
    console.log("[Dashboard] Changing sort order to:", order);
    setSortOrder(order);
  };

  useEffect(() => {
    console.log(
      "[Dashboard] Component mounted or activeTab changed:",
      activeTab
    );
    console.log("[Dashboard] Current loading state:", loading);
    if (!loading) {
      const status = getActiveTab(activeTab);
      console.log(
        "[Dashboard] Dispatching getMedicineByStatus with status:",
        status
      );
      dispatch(getMedicineByStatus(status));
    }
    return () => {
      console.log("[Dashboard] Cleaning up - clearing error");
      dispatch(clearError());
    };
  }, [activeTab]);

  useEffect(() => {
    console.log(
      "[Dashboard] State update - loading:",
      loading,
      "status:",
      status,
      "error:",
      error
    );
    console.log(
      "[Dashboard] Filtered medicines count:",
      filteredMedicines.length
    );
  }, [loading, status, error, filteredMedicines]);

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-color-gray-200 p-2 sm:p-6">
      <div className="overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-color-gray-200"
        >
          <TabsList className="">
            <TabsTrigger value="waiting" className="px-0 py-0">
              <div
                className={`w-full bg-white px-4 py-2 h-full rounded-tl-[4px] flex items-center border-r-[1.5px] border-color-gray-250 ${
                  activeTab === "waiting"
                    ? "text-logoblue"
                    : "text-color-gray-400"
                }`}
              >
                Waiting List
              </div>
            </TabsTrigger>
            <TabsTrigger value="approved" className="px-0 py-0">
              <div
                className={`w-full bg-white px-4 py-2 h-full flex items-center border-r-[1.5px] border-color-gray-250 ${
                  activeTab === "approved"
                    ? "text-logoblue"
                    : "text-color-gray-400"
                }`}
              >
                Certified List
              </div>
            </TabsTrigger>
            <TabsTrigger value="completed" className="px-0 py-0">
              <div
                className={`w-full bg-white px-4 py-2 h-full rounded-tr-[4px] flex items-center  ${
                  activeTab === "completed"
                    ? "text-logoblue"
                    : "text-color-gray-400"
                }`}
              >
                All Medicine List
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-6 p-2 sm:p-6 min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-10rem)] overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-b-[8px] sm:rounded-tr-[8px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl font-semibold text-nowrap">
                {activeTab === "waiting"
                  ? "Waiting List"
                  : activeTab === "approved"
                  ? "Certified List"
                  : "All Medicine List"}
              </h1>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto mb-2 sm:mb-0">
                <Input
                  type="search"
                  placeholder="Search"
                  className="flex-grow sm:flex-grow-0 sm:w-96 rounded-[8px] border-color-gray-250 placeholder:text-color-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FilterDialog onFilterChange={handleFilter} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="px-4 text-lg rounded-[8px] hover:bg-color-gray-200">
                      <SortIcon />
                      <span className="text-logoblue">Sort</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40" align="end">
                    <div className="grid gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleSortOrderChange("new")}
                        className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                          sortOrder === "new"
                            ? "text-logoblue bg-color-gray-200"
                            : "hover:text-logoblue"
                        }`}
                      >
                        First New
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleSortOrderChange("old")}
                        className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                          sortOrder === "old"
                            ? "text-logoblue bg-color-gray-200"
                            : "hover:text-logoblue"
                        }`}
                      >
                        First Old
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {loading ? (
              <div className="min-h-[40vh] md:min-h-[70vh] flex justify-center items-center w-full">
                <Spinner />
              </div>
            ) : (
              <div>
                <div className="hidden sm:grid sm:grid-cols-[1fr,100px,120px,100px] items-center gap-4 p-4">
                  <div className="font-medium text-color-gray-400">
                    Medicine Name
                  </div>
                  <div className="font-medium text-center text-color-gray-400">
                    Date
                  </div>
                  <div className="font-medium text-center text-color-gray-400">
                    Group Type
                  </div>
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
                          ? `/dashboard/medicines/certified/${encodeURIComponent(
                              medicine.product_name as string
                            )}`
                          : `/dashboard/medicines/${encodeURIComponent(
                              medicine.product_name as string
                            )}`
                      }
                      className={`flex flex-wrap sm:grid grid-cols-[minmax(0,1fr),100px,120px,100px] items-center gap-4 p-3 hover:bg-gray-50 rounded-[8px] cursor-pointer`}
                    >
                      <div className="truncate">{medicine.product_name}</div>

                      <div className="text-center">
                        {format(parseISO(medicine.created_at), "dd/MM/yyyy")}
                      </div>
                      <div className="flex justify-center">
                        {medicine.category && medicine.category !== "" && (
                          <Badge
                            className={`${getGroupTypeBadgeColor(
                              medicine.category as string
                            )} text-white whitespace-nowrap py-2`}
                          >
                            {medicine.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={`${getStatusBadgeStyle(
                            medicine.status as string
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
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
