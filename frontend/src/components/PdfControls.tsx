import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PdfControlsProps {
  onSummaryType: (type: string) => void;
  onCustomPrompt: (prompt: string) => void;
  onDownload: () => void;
  isProcessing: boolean;
}

export const PdfControls = ({
  onSummaryType,
  onCustomPrompt,
  onDownload,
  isProcessing
}: PdfControlsProps) => {
  const [customPrompt, setCustomPrompt] = useState("");

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
              onClick={() => {
                onCustomPrompt(customPrompt);
                setCustomPrompt("");
              }}
              disabled={isProcessing || !customPrompt}
            >
              Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};