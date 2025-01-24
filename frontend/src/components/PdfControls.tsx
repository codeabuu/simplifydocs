import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from 'sonner';

interface PdfControlsProps {
  onSummaryType: (type: string) => void;
  onCustomPrompt: (prompt: string) => Promise<void>; // Function to handle custom prompts
  onDownload: () => void;
  isProcessing: boolean;
  fileId: string | null;
}

export const PdfControls = ({
  onSummaryType,
  onCustomPrompt,
  onDownload,
  isProcessing,
  fileId,
}: PdfControlsProps) => {
  const [customPrompt, setCustomPrompt] = useState("");

  const handleCustomPrompt = async () => {
    if (!fileId) {
      toast.error('Please upload a PDF first');
      return;
    }
    if (!customPrompt.trim()) {
      toast.error('Please enter a custom prompt');
      return;
    }
    try {
      await onCustomPrompt(customPrompt); // Call the API with the custom prompt
      setCustomPrompt(""); // Clear the input field
      toast.success('Custom prompt processed successfully!');
    } catch (error) {
      console.error('Error processing custom prompt:', error);
      toast.error('Failed to process custom prompt');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => onSummaryType("summary")}
            disabled={isProcessing}
            variant="secondary"
          >
            General Summary
          </Button>
          <Button 
            onClick={() => onSummaryType("beginners")}
            disabled={isProcessing}
            variant="secondary"
          >
            Beginner Summary
          </Button>
          <Button 
            onClick={() => onSummaryType("technical")}
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