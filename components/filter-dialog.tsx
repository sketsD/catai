"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import FilterIcon from "./FilterIcon";

interface FilterDialogProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  groupType: {
    all: boolean;
    technical: boolean;
    pharmacy: boolean;
  };
  date: {
    oneDay: boolean;
    threeWeeks: boolean;
  };
}

export function FilterDialog({ onFilterChange }: FilterDialogProps) {
  const [filters, setFilters] = React.useState<FilterState>({
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

  const handleGroupTypeChange = (key: keyof typeof filters.groupType) => {
    const newGroupType = { ...filters.groupType };

    if (key === "all") {
      newGroupType.all = true;
      newGroupType.technical = false;
      newGroupType.pharmacy = false;
    } else {
      newGroupType.all = false;
      newGroupType[key] = !newGroupType[key];

      if (!newGroupType.technical && !newGroupType.pharmacy) {
        newGroupType.all = true;
      }
    }

    const newFilters = {
      ...filters,
      groupType: newGroupType,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (key: keyof typeof filters.date) => {
    const newDate = { ...filters.date };
    Object.keys(newDate).forEach((k) => {
      newDate[k as keyof typeof filters.date] = k === key;
    });

    const newFilters = {
      ...filters,
      date: newDate,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getItemStyle = (isChecked: boolean) => {
    return `flex items-center gap-3 pl-2 py-3 rounded-[8px] transition-colors duration-200 ${
      isChecked
        ? "text-logoblue bg-color-gray-200"
        : "hover:text-logoblue hover:bg-color-gray-200"
    }`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="border-0 w-24">
        <Button className="p-0 text-lg rounded-[8px] hover:bg-color-gray-200">
          <FilterIcon />
          <span className="text-logoblue">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Group Type</h4>
            <div className="grid gap-2">
              <div className={getItemStyle(filters.groupType.all)}>
                <Checkbox
                  id="all"
                  checked={filters.groupType.all}
                  onCheckedChange={() => handleGroupTypeChange("all")}
                  className={filters.groupType.all ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="all"
                  className={filters.groupType.all ? "text-logoblue" : ""}
                >
                  All
                </Label>
              </div>
              <div className={getItemStyle(filters.groupType.technical)}>
                <Checkbox
                  id="technical"
                  checked={filters.groupType.technical}
                  onCheckedChange={() => handleGroupTypeChange("technical")}
                  className={filters.groupType.technical ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="technical"
                  className={filters.groupType.technical ? "text-logoblue" : ""}
                >
                  Technical
                </Label>
              </div>
              <div className={getItemStyle(filters.groupType.pharmacy)}>
                <Checkbox
                  id="pharmacy"
                  checked={filters.groupType.pharmacy}
                  onCheckedChange={() => handleGroupTypeChange("pharmacy")}
                  className={filters.groupType.pharmacy ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="pharmacy"
                  className={filters.groupType.pharmacy ? "text-logoblue" : ""}
                >
                  Pharmacy
                </Label>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Date</h4>
            <div className="grid gap-2">
              <div className={getItemStyle(filters.date.oneDay)}>
                <Checkbox
                  id="oneDay"
                  checked={filters.date.oneDay}
                  onCheckedChange={() => handleDateChange("oneDay")}
                  className={filters.date.oneDay ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="oneDay"
                  className={filters.date.oneDay ? "text-logoblue" : ""}
                >
                  One Day
                </Label>
              </div>
              <div className={getItemStyle(filters.date.threeWeeks)}>
                <Checkbox
                  id="threeWeeks"
                  checked={filters.date.threeWeeks}
                  onCheckedChange={() => handleDateChange("threeWeeks")}
                  className={filters.date.threeWeeks ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="threeWeeks"
                  className={filters.date.threeWeeks ? "text-logoblue" : ""}
                >
                  Three Weeks
                </Label>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
