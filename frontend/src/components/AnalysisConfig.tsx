import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from 'sonner';

interface AnalysisConfigProps {
  fileId: string;
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
  onAnalyze: () => Promise<void>;
  onGenerate: () => Promise<void>;
  isAnalyzing: boolean;
  isGenerating: boolean;
}

export const AnalysisConfig = ({
  fileId,
  sampleSize,
  onSampleSizeChange,
  onAnalyze,
  onGenerate,
  isAnalyzing,
  isGenerating,
}: AnalysisConfigProps) => {
  const [activeButton, setActiveButton] = useState<'analyze' | 'generate'>('analyze');
  
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter Sample Chart Size</label>
        <Input
          type="number"
          value={sampleSize}
          onChange={(e) => onSampleSizeChange(parseInt(e.target.value))}
          min={1}
          className="w-full"
        />
      </div>
      
      {/* <div className="space-y-2">
        <label className="text-sm font-medium">Chart Type</label>
        <Select defaultValue="bar">
          <SelectTrigger>
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="scatter">Scatter Plot</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div className="flex gap-4">
        <Button 
          onClick={async () => {
            setActiveButton('analyze');
            await onAnalyze();
          }}
          className="flex-1"
          disabled={isAnalyzing}
          variant={activeButton === 'analyze' ? 'default' : 'secondary'}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : "Analyze Data"}
        </Button>
        <Button 
          onClick={async () => {
            setActiveButton('generate');
            await onGenerate();
          }}
          className="flex-1"
          disabled={isGenerating}
          variant={activeButton === 'generate' ? 'default' : 'secondary'}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : "Generate Charts"}
        </Button>
      </div>
    </div>
  );
};