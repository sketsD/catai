import type React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push("ellipsis");
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`px-3 h-10 rounded-xl duration-100 border-none ${
              currentPage === 1
                ? "bg-white text-gray-400 hover:text-gray-400"
                : "bg-logoblue text-white cursor-pointer hover:bg-blue-700 hover:text-white"
            } `}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            isActive={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                className={`cursor-pointer rounded-xl h-10`}
                onClick={() => onPageChange(pageNumber as number)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* <div className=> */}
        <PaginationItem>
          <PaginationNext
            className={`px-3 h-10 rounded-xl  duration-100 border-none ${
              currentPage === totalPages
                ? "bg-white text-gray-400 hover:text-gray-400"
                : "bg-logoblue text-white cursor-pointer hover:bg-blue-700 hover:text-white"
            } `}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            isActive={currentPage === totalPages}
          />
        </PaginationItem>
        {/* </div> */}
      </PaginationContent>
    </Pagination>
  );
};
