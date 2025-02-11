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
import FilterIcon from "./ui/FilterIcon";
import { useAppSelector } from "@/store/hooks";
import { selectUniqueCategories } from "@/store/slices/medicineSlice";
import { RootState } from "@/store/store";
import { parseISO } from "date-fns";
import { X } from "lucide-react";

interface FilterDialogProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  groupType: {
    all: boolean;
    [key: string]: boolean;
  };
  date: {
    oneDay: boolean;
    threeWeeks: boolean;
  };
}

export function FilterDialog({ onFilterChange }: FilterDialogProps) {
  const categories = useAppSelector(selectUniqueCategories);

  // Создаем начальное состояние с динамическими категориями
  const initialGroupType = {
    all: true,
    ...Object.fromEntries(categories.map((category) => [category, false])),
  };

  const [filters, setFilters] = React.useState<FilterState>({
    groupType: initialGroupType,
    date: {
      oneDay: false,
      threeWeeks: false,
    },
  });

  // Обновляем фильтры при изменении списка категорий
  React.useEffect(() => {
    // Создаем новый объект только с актуальными категориями
    const newGroupType = {
      all: filters.groupType.all,
      ...Object.fromEntries(
        categories.map((category) => [
          category,
          // Сохраняем предыдущее состояние категории, если она была
          filters.groupType[category] || false,
        ])
      ),
    };

    // Если ни одна категория не выбрана (кроме all), включаем all
    const hasSelectedCategory = Object.entries(newGroupType).some(
      ([k, v]) => k !== "all" && v
    );

    if (!hasSelectedCategory) {
      newGroupType.all = true;
    }

    const newFilters = {
      ...filters,
      groupType: newGroupType,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [categories]);

  const handleGroupTypeChange = (key: string) => {
    const newGroupType = { ...filters.groupType };

    if (key === "all") {
      // Если выбрано "All", сбрасываем все остальные
      Object.keys(newGroupType).forEach((k) => {
        newGroupType[k] = k === "all";
      });
    } else {
      // Если выбрана конкретная категория
      newGroupType.all = false;
      newGroupType[key] = !newGroupType[key];

      // Если ни одна категория не выбрана, включаем "All"
      const hasSelectedCategory = Object.entries(newGroupType).some(
        ([k, v]) => k !== "all" && v
      );
      if (!hasSelectedCategory) {
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

    // Если фильтр уже включен, выключаем его
    if (newDate[key]) {
      newDate[key] = false;
    } else {
      // Иначе включаем этот фильтр и выключаем другой
      Object.keys(newDate).forEach((k) => {
        newDate[k as keyof typeof filters.date] = k === key;
      });
    }

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

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = React.useMemo(() => {
    return (
      !filters.groupType.all || // если не выбран "All"
      filters.date.oneDay || // если выбран "One Day"
      filters.date.threeWeeks // если выбран "Three Weeks"
    );
  }, [filters]);

  // Сброс всех фильтров
  const resetFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFilters = {
      groupType: {
        all: true,
        ...Object.fromEntries(categories.map((category) => [category, false])),
      },
      date: {
        oneDay: false,
        threeWeeks: false,
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild className="border-0 w-24">
          <Button className="p-0 text-lg rounded-[8px] hover:bg-color-gray-200">
            <FilterIcon />
            <span className="text-logoblue">Filter</span>
          </Button>
        </PopoverTrigger>
        {hasActiveFilters && (
          <div
            className="absolute -right-1 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-logoblue flex items-center justify-center cursor-pointer"
            onClick={resetFilters}
          >
            <X className="h-2 w-2 text-white" />
          </div>
        )}
      </div>
      <PopoverContent className="w-44" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Group Type</h4>
            <div className="grid gap-2 max-h-[210px] overflow-y-auto scrollbar-hide hover:scrollbar-default">
              <style jsx global>{`
                .scrollbar-hide {
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide:hover {
                  scrollbar-width: thin;
                }
                .scrollbar-hide:hover::-webkit-scrollbar {
                  display: block;
                  width: 6px;
                }
                .scrollbar-hide:hover::-webkit-scrollbar-thumb {
                  background-color: #d1d5db;
                  border-radius: 3px;
                }
                .scrollbar-hide:hover::-webkit-scrollbar-track {
                  background: transparent;
                }
              `}</style>
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
              {categories.map((category) => (
                <div
                  key={category}
                  className={getItemStyle(filters.groupType[category])}
                >
                  <Checkbox
                    id={category}
                    checked={filters.groupType[category]}
                    onCheckedChange={() => handleGroupTypeChange(category)}
                    className={
                      filters.groupType[category] ? "text-logoblue" : ""
                    }
                  />
                  <Label
                    htmlFor={category}
                    className={
                      filters.groupType[category] ? "text-logoblue" : ""
                    }
                  >
                    {category}
                  </Label>
                </div>
              ))}
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

export const selectFilteredMedicines = (
  state: RootState,
  filters: FilterState,
  searchQuery: string = ""
) => {
  return state.medicine.medicines.filter((medicine) => {
    // Поиск
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? medicine.product_name?.toLowerCase().includes(searchLower) ||
        medicine.metadata_id?.toLowerCase().includes(searchLower) ||
        medicine.category?.toLowerCase().includes(searchLower) ||
        medicine.manufacturer?.toLowerCase().includes(searchLower)
      : true;

    // Фильтр по группе
    const matchesGroup = filters.groupType.all
      ? true
      : filters.groupType["No Category"]
      ? !medicine.category || medicine.category === ""
      : medicine.category && filters.groupType[medicine.category];

    // Фильтр по дате
    let matchesDate = true;
    if (filters.date.oneDay || filters.date.threeWeeks) {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
      const medicineDate = parseISO(medicine.created_at);

      if (filters.date.oneDay) {
        matchesDate = medicineDate >= oneDayAgo;
      } else {
        matchesDate = medicineDate >= threeWeeksAgo;
      }
    }

    return matchesSearch && matchesGroup && matchesDate;
  });
};
