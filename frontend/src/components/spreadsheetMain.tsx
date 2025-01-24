import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisConfig } from '@/components/AnalysisConfig';
import { ChatInterface } from '@/components/ChatInterface';
import { toast } from 'sonner';
import { analyzeData, generateCharts } from '@/lib/api';

interface SpreadsheetAnalysisProps {
  fileId: string | null;
  setFileId: (fileId: string | null) => void;
  onCustomPrompt: (prompt: string) => Promise<void>;
}

export const SpreadsheetAnalysis = ({
  fileId,
  setFileId,
  onCustomPrompt,
}: SpreadsheetAnalysisProps) => {
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null);
  const [sampleSize, setSampleSize] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [generatedCharts, setGeneratedCharts] = useState<{ [key: string]: string }>({});

  const handleSpreadsheetUpload = (file: File, uploadedFileId: string) => {
    setSpreadsheetFile(file);
    setFileId(uploadedFileId);
  };

  const handleReplaceSpreadsheet = () => {
    setSpreadsheetFile(null);
    setFileId(null);
    setAnalysisResult(null);
    setGeneratedCharts({});
  };

  const handleAnalyze = async () => {
    if (!fileId) {
      toast.error('Please upload a spreadsheet first');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeData(fileId);
      setAnalysisResult(result.chart_suggestion);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!fileId) {
      toast.error('Please upload a spreadsheet first');
      return;
    }
    setIsGenerating(true);
    try {
      const chartsData = await generateCharts(fileId, sampleSize);
      console.log('Charts data received:', chartsData);

      if (!chartsData) {
        throw new Error('No charts data received');
      }

      // Process the charts
      const processedCharts: { [key: string]: string } = {};

      Object.entries(chartsData).forEach(([chartName, chartData]) => {
        if (typeof chartData === 'string') {
          const base64Prefix = 'data:image/png;base64,';
          processedCharts[chartName] = chartData.startsWith(base64Prefix)
            ? chartData
            : `${base64Prefix}${chartData}`;
          console.log(`Processed chart ${chartName}`); // Debug log
        }
      });

      console.log('Processed charts:', processedCharts); // Debug log
      setGeneratedCharts(processedCharts);
      toast.success('Charts generated successfully!');
    } catch (error) {
      console.error('Chart generation error:', error);
      toast.error('Failed to generate charts');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        {!spreadsheetFile ? (
          <FileUpload onFileUpload={handleSpreadsheetUpload} />
        ) : (
          <div className="animate-fadeIn">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="font-medium">Uploaded File:</p>
              <p className="text-sm text-gray-500">{spreadsheetFile.name}</p>
              <button
                className="text-sm text-blue-600 mt-2"
                onClick={handleReplaceSpreadsheet}
              >
                Replace File
              </button>
            </div>

            {/* Analysis Output Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="font-medium">Analysis Results:</p>
              {isAnalyzing ? (
                <p className="text-sm text-gray-500">Analyzing...</p>
              ) : analysisResult ? (
                <p className="text-sm text-gray-500">{analysisResult}</p>
              ) : (
                <p className="text-sm text-gray-500">Your analysis output will appear here.</p>
              )}
            </div>

            {/* Chart Display Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[400px] overflow-auto">
              {Object.keys(generatedCharts).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(generatedCharts).map(([chartName, chartData]) => (
                    <div key={chartName} className="chart-container">
                      <h3 className="text-center font-medium text-lg mb-4">
                        {chartName.replace(/_/g, ' ').toUpperCase()}
                      </h3>
                      <div className="flex justify-center">
                        <img
                          src={chartData}
                          alt={`${chartName} chart`}
                          className="max-w-full h-auto object-contain"
                          onError={(e) => {
                            console.error(`Error loading chart: ${chartName}`);
                            toast.error(`Failed to load ${chartName} chart`);
                          }}
                          onLoad={() => console.log(`Chart loaded successfully: ${chartName}`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        Generating charts... 
                        <span className="animate-spin">⏳</span>
                      </span>
                    ) : (
                      'Charts will appear here'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <AnalysisConfig
          fileId={fileId || ''}
          sampleSize={sampleSize}
          onSampleSizeChange={setSampleSize}
          onAnalyze={handleAnalyze}
          onGenerate={handleGenerate}
          isAnalyzing={isAnalyzing}
          isGenerating={isGenerating}
        />

        <ChatInterface fileId={fileId} onSendMessage={onCustomPrompt} />
      </div>
    </div>
  );
};