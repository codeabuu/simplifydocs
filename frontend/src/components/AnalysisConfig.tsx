import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeData, generateCharts } from '@/lib/api'; // Adjust the import path as needed

interface AnalysisConfigProps {
  fileId: string; // Add fileId prop
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
  onAnalyze: (result: any) => void; // Update to pass analysis result
  onGenerate: (charts: any) => void; // Update to pass generated charts
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
  isGenerating
}: AnalysisConfigProps) => {
  
  const handleAnalyze = async () => {
    try {
      // Analysis doesn't use sampleSize
      const result = await analyzeData(fileId);
      onAnalyze(result);
    } catch (error) {
      console.error('Error analyzing data:', error);
    }
  };

  const handleGenerate = async () => {
    try {
      // Only generate charts using the sampleSize
      const charts = await generateCharts(fileId, sampleSize);
      onGenerate(charts);
    } catch (error) {
      console.error('Error generating charts:', error);
    }
  };

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
          onClick={handleAnalyze} 
          className="flex-1"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
        <Button 
          onClick={handleGenerate}
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
