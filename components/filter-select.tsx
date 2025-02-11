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
import FilterIcon from "./ui/FilterIcon";

interface FilterSelectProps {
  onFilterChange: (filters: FilterStateUsers) => void;
}

export interface FilterStateUsers {
  all: boolean;
  pharm: boolean;
  tech: boolean;
  admin: boolean;
}

export function FilterSelect({ onFilterChange }: FilterSelectProps) {
  const [filters, setFilters] = React.useState<FilterStateUsers>({
    all: true,
    pharm: false,
    tech: false,
    admin: false,
  });

  const handleFilterChange = (key: keyof FilterStateUsers) => {
    const newFilters = { ...filters };

    if (key === "all") {
      newFilters.all = true;
      newFilters.pharm = false;
      newFilters.tech = false;
      newFilters.admin = false;
    } else {
      newFilters.all = false;
      newFilters[key] = !newFilters[key];

      if (!newFilters.pharm && !newFilters.tech && !newFilters.admin) {
        newFilters.all = true;
      }
    }

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
      <PopoverTrigger asChild>
        <Button className="border-0 w-[120px] p-0 text-lg rounded-[8px] hover:bg-color-gray-200">
          <div className="text-logoblue flex gap-2 items-center justify-center">
            <FilterIcon />
            Filter
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Filter Types</h4>
            <div className="grid gap-2">
              <div className={getItemStyle(filters.all)}>
                <Checkbox
                  id="all"
                  checked={filters.all}
                  onCheckedChange={() => handleFilterChange("all")}
                  className={filters.all ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="all"
                  className={filters.all ? "text-logoblue" : ""}
                >
                  All Types
                </Label>
              </div>
              <div className={getItemStyle(filters.pharm)}>
                <Checkbox
                  id="pharmacy"
                  checked={filters.pharm}
                  onCheckedChange={() => handleFilterChange("pharm")}
                  className={filters.pharm ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="pharmacy"
                  className={filters.pharm ? "text-logoblue" : ""}
                >
                  Pharmacy
                </Label>
              </div>
              <div className={getItemStyle(filters.tech)}>
                <Checkbox
                  id="technical"
                  checked={filters.tech}
                  onCheckedChange={() => handleFilterChange("tech")}
                  className={filters.tech ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="technical"
                  className={filters.tech ? "text-logoblue" : ""}
                >
                  Technical
                </Label>
              </div>
              <div className={getItemStyle(filters.admin)}>
                <Checkbox
                  id="admin"
                  checked={filters.admin}
                  onCheckedChange={() => handleFilterChange("admin")}
                  className={filters.admin ? "text-logoblue" : ""}
                />
                <Label
                  htmlFor="admin"
                  className={filters.admin ? "text-logoblue" : ""}
                >
                  Admin
                </Label>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
