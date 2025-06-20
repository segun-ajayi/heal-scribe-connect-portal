import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // or wherever your Button lives

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export const PaginationControls = ({
                                       page,
                                       totalPages,
                                       onPageChange,
                                       isLoading = false,
                                   }: PaginationControlsProps) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page <= 1 || isLoading}
                className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </Button>

            <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

            <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages || isLoading}
                className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    );
};