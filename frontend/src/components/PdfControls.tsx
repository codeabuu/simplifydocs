import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from 'sonner';

interface PdfControlsProps {
  onSummaryType: (type: string) => void;
  onCustomPrompt: (prompt: string) => void;
  onDownload: () => void;
  fileId: string | null;
  isProcessing: boolean;
}

export const PdfControls = ({
  onSummaryType,
  onCustomPrompt,
  onDownload,
  fileId,
  isProcessing,
}: PdfControlsProps) => {
  const [customPrompt, setCustomPrompt] = useState("");

  const handleSummaryType = (type: string) => {
    if (!fileId) {
      toast.error('Please upload a PDF first');
      return;
    }
    onSummaryType(type); // Delegate to parent component
  };

  const handleCustomPrompt = () => {
    if (!fileId) {
      toast.error('Please upload a PDF first');
      return;
    }
    if (!customPrompt.trim()) {
      toast.error('Please enter a custom prompt');
      return;
    }
    onCustomPrompt(customPrompt); // Delegate to parent component
    setCustomPrompt(""); // Clear the input field
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleSummaryType("simple_summary")} // General Summary
            disabled={isProcessing}
            variant="secondary"
          >
            General Summary
          </Button>
          <Button 
            onClick={() => handleSummaryType("beginners")} // Beginner Summary
            disabled={isProcessing}
            variant="secondary"
          >
            Beginner Summary
          </Button>
          <Button 
            onClick={() => handleSummaryType("technical")} // Technical Summary
            disabled={isProcessing}
            variant="secondary"
          >
            Technical Summary
          </Button>
          <Button 
            onClick={onDownload}
            disabled={isProcessing}
            variant="outline"
          >
            Download PDF
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Prompt</label>
          <div className="flex gap-2">
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt..."
              disabled={isProcessing}
            />
            <Button 
              onClick={handleCustomPrompt}
              disabled={isProcessing || !customPrompt.trim()}
            >
              Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};