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
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSummaryType = (type: string) => {
    if (!fileId) {
      toast.error('Please upload a PDF first');
      return;
    }
    setActiveButton(type);
    onSummaryType(type);
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
    setActiveButton('custom');
    onCustomPrompt(customPrompt);
    setCustomPrompt("");
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleSummaryType("simple_summary")}
            disabled={isProcessing}
            variant={activeButton === "simple_summary" ? "default" : "secondary"}
          >
            General Summary
          </Button>
          <Button 
            onClick={() => handleSummaryType("beginners")}
            disabled={isProcessing}
            variant={activeButton === "beginners" ? "default" : "secondary"}
          >
            Beginner Summary
          </Button>
          <Button 
            onClick={() => handleSummaryType("technical")}
            disabled={isProcessing}
            variant={activeButton === "technical" ? "default" : "secondary"}
          >
            Technical Summary
          </Button>
          <Button 
            onClick={() => {
              setActiveButton('download');
              onDownload();
            }}
            disabled={isProcessing}
            variant={activeButton === "download" ? "default" : "outline"}
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
              variant={"default"}
            >
              Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};