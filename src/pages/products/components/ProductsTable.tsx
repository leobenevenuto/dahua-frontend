import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, FileText, Calendar, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import type { ProductsHeaderData } from "@/interfaces/products/pruducts.interface";

interface ProductsTableProps {
  data: ProductsHeaderData | null;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const getStatusBadge = (status: 'waiting_integration' | 'completed' | 'error') => {
  if (status === 'completed') {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    );
  } else if (status === 'waiting_integration') {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        <Clock className="h-3 w-3 mr-1" />
        Waiting Integration
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <AlertCircle className="h-3 w-3 mr-1" />
        Error
      </Badge>
    );
  }
};

export default function ProductsTable({ data, loading, error, onPageChange, currentPage }: ProductsTableProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading products: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPagination = () => {
    if (!data?.pagination) return null;

    const { page, totalPages } = data.pagination;
    const pages = [];
    
    // Show first page
    if (page > 3) {
      pages.push(1);
      if (page > 4) pages.push('...');
    }
    
    // Show pages around current page
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
      pages.push(i);
    }
    
    // Show last page
    if (page < totalPages - 2) {
      if (page < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => page > 1 && onPageChange(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {pages.map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(pageNum as number)}
                  isActive={pageNum === page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => page < totalPages && onPageChange(page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Products Integration
        </CardTitle>
        <CardDescription>
          Overview of product integration files and their processing status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Reading Date</TableHead>
                  <TableHead className="font-semibold">Source File</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((item, index) => (
                  <TableRow key={`${item.createdAt}-${index}`} className="hover:bg-accent/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.sourceFileName}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 px-3 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {data?.data.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No products found
              </div>
            )}
            
            {renderPagination()}
          </>
        )}
      </CardContent>
    </Card>
  );
} 