import { ChevronLeft, ChevronRight } from "lucide-react";
import { Market } from "@/utils/types";
import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  activeMarkets: Market[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
};

export const PaginationControls = ({
  currentPage,
  setCurrentPage,
  activeMarkets,
  totalPages,
  startIndex,
  endIndex,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-2 py-4">
      {/* Info Text */}
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing {startIndex + 1} to {Math.min(endIndex, activeMarkets.length)}{" "}
        of {activeMarkets.length} markets
      </div>

      {/* Pagination Buttons */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers - Hide on very small screens */}
        <div className="hidden xs:flex items-center flex-wrap gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const showPage =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1;

            const showEllipsis =
              (page === 2 && currentPage > 4) ||
              (page === totalPages - 1 && currentPage < totalPages - 3);

            if (!showPage && !showEllipsis) return null;

            if (showEllipsis) {
              return (
                <span
                  key={`ellipsis-${page}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-[32px]"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
