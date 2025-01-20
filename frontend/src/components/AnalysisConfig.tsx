import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AnalysisConfigProps {
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  isAnalyzing: boolean;
  isGenerating: boolean;
}

export const AnalysisConfig = ({
  sampleSize,
  onSampleSizeChange,
  onAnalyze,
  onGenerate,
  isAnalyzing,
  isGenerating
}: AnalysisConfigProps) => {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sample Size</label>
        <Input
          type="number"
          value={sampleSize}
          onChange={(e) => onSampleSizeChange(parseInt(e.target.value))}
          min={1}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
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
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={onAnalyze} 
          className="flex-1"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
        <Button 
          onClick={onGenerate}
          className="flex-1"
          variant="secondary"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Charts"}
        </Button>
      </div>
    </div>
  );
};