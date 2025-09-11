import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, X } from "lucide-react";
import { inboundService } from "@/services/inbound.service";

interface RunScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete?: () => void;
}

export default function RunScanModal({ open, onOpenChange, onScanComplete }: RunScanModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRunScan = async () => {
    try {
      setIsScanning(true);
      setError(null);
      const response = await inboundService.processScan();
      setScanMessage(response.message);
      setScanComplete(true);
      onScanComplete?.();
    } catch (err: unknown) {
      // If error is 422, it means no files to process - treat as success
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { status: number; data?: { message?: string } } };
        if (axiosError.response.status === 422) {
          setScanMessage(axiosError.response.data?.message || 'No files found to process');
          setScanComplete(true);
          onScanComplete?.();
        } else {
          setError(axiosError.response.data?.message || 'Failed to run scan');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to run scan');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset states after a short delay to avoid visual glitch
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(false);
      setScanMessage("");
      setError(null);
    }, 300);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <X className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Error</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
          <Button onClick={handleClose} className="w-full">
            OK
          </Button>
        </div>
      );
    }

    if (scanComplete) {
      return (
        <div className="text-center py-8">
          <div className="text-green-600 mb-4">
            <CheckCircle className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Scan Results</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{scanMessage}</p>
          <Button onClick={handleClose} className="w-full">
            OK
          </Button>
        </div>
      );
    }

    if (isScanning) {
      return (
        <div className="text-center py-8">
          <div className="mb-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
          </div>
          <p className="text-lg font-medium mb-2">Processing inbound files...</p>
          <p className="text-sm text-muted-foreground">Scanning inbound files, please wait...</p>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium mb-6">Are you sure you want to run the scan?</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleRunScan} className="flex-1">
            Run Scan
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={isScanning || scanComplete || error ? "sr-only" : ""}>
          <DialogTitle>Run Scan</DialogTitle>
          <DialogDescription>
            Processing inbound files...
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
} 