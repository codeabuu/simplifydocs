import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from 'sonner';
import { summarizePdf } from '@/lib/api'; // Import the summarizePdf function

interface PdfControlsProps {
  onSummaryType: (type: string) => void;
  onCustomPrompt: (prompt: string) => Promise<void>;
  onDownload: () => void;
  fileId: string | null;
}

export const PdfControls = ({
  onSummaryType,
  onCustomPrompt,
  onDownload,
  fileId,
}: PdfControlsProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSummaryType = async (type: string) => {
    if (!fileId) {
      toast.error('Please upload a PDF first');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await summarizePdf(fileId, type); // Call the summarizePdf API
      onSummaryType(response); // Pass the response to the parent component
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsProcessing(false);
    }
  };

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
      setIsProcessing(true);
      await onCustomPrompt(customPrompt); // Call the parent component's custom prompt handler
      setCustomPrompt(""); // Clear the input field
      toast.success('Custom prompt processed successfully!');
    } catch (error) {
      console.error('Error processing custom prompt:', error);
      toast.error('Failed to process custom prompt');
    } finally {
      setIsProcessing(false);
    }
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