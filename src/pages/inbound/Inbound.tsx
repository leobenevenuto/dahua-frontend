import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, AlertCircle, Clock, Play } from "lucide-react";
import { useInbounds } from "@/hooks/useInbounds";
import InboundTable from "./components/InboundTable";
import RunScanModal from "./components/RunScanModal";

export default function Inbound() {
  const { data, loading, error, goToPage, page, refresh } = useInbounds();
  const [showRunScanModal, setShowRunScanModal] = useState(false);

  const handleScanComplete = () => {
    refresh(); // Refresh the table after scan completes
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-secondary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inbound</h1>
            <p className="text-muted-foreground">Monitor and manage inbound file processing</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowRunScanModal(true)}
          className="flex items-center gap-2"
          size="lg"
        >
          <Play className="h-4 w-4" />
          Run Scan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Invoice Requested</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Invoice Received</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sent to WMS</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inbound Table */}
      <InboundTable 
        data={data}
        loading={loading}
        error={error}
        onPageChange={goToPage}
        currentPage={page}
      />

      {/* Run Scan Modal */}
      <RunScanModal 
        open={showRunScanModal}
        onOpenChange={setShowRunScanModal}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
} 