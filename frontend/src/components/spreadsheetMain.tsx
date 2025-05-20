import { useState, useRef } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisConfig } from '@/components/AnalysisConfig';
import { ChatInterface } from '@/components/ChatInterface';
import { toast } from 'sonner';
import { analyzeData, generateCharts, askQuestion } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';
import { Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SpreadsheetAnalysisProps {
  state: {
    file: File | null;
    fileId: string | null;
    analysis: {
      sampleSize: number;
      analysisResult: string | null;
      generatedCharts: Record<string, string>;
      messages: Array<{ id: string; text: string; sender: 'user' | 'ai' }>;
    };
  };
  onStateChange: (state: any) => void;
  onFileUpload: (file: File, fileId: string) => void;
  onReset: () => void;
}

export const SpreadsheetAnalysis = ({
  state,
  onStateChange,
  onFileUpload,
  onReset
}: SpreadsheetAnalysisProps) => {
  const { file, fileId, analysis } = state;
  const { sampleSize, analysisResult, generatedCharts, messages } = analysis;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const streamController = useRef<AbortController | null>(null);

  const handleSpreadsheetUpload = (file: File, fileId: string) => {
    onFileUpload(file, fileId);
  };

  const handleReplaceSpreadsheet = () => {
    setShowReplaceConfirm(true);
  };

  const confirmReplace = () => {
    setShowReplaceConfirm(false);
    onReset();
  };

  const cancelReplace = () => {
    setShowReplaceConfirm(false);
  };

  const downloadChart = (chartName: string, chartData: string) => {
    try {
      const link = document.createElement('a');
      link.href = chartData;
      link.download = `${chartName.replace(/\s+/g, '_')}_chart.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Chart downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download chart');
    }
  };

  const handleAnalyze = async () => {
    if (!fileId) {
      toast.error('Please upload a spreadsheet first');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeData(fileId);
      onStateChange({
        ...state,
        analysis: {
          ...analysis,
          analysisResult: result.chart_suggestion
        }
      });
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
      const processedCharts: Record<string, string> = {};

      Object.entries(chartsData).forEach(([chartName, chartData]) => {
        if (typeof chartData === 'string') {
          processedCharts[chartName] = chartData.startsWith('data:image')
            ? chartData
            : `data:image/png;base64,${chartData}`;
        }
      });

      onStateChange({
        ...state,
        analysis: {
          ...analysis,
          generatedCharts: processedCharts
        }
      });
      toast.success('Charts generated successfully!');
    } catch (error) {
      console.error('Chart generation error:', error);
      toast.error('Failed to generate charts');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSampleSizeChange = (size: number) => {
    onStateChange({
      ...state,
      analysis: {
        ...analysis,
        sampleSize: size
      }
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!fileId) {
      toast.error("Please upload a file first.");
      return;
    }

    const userMessage = { id: uuidv4(), text, sender: 'user' as const };
    const aiMessageId = uuidv4();
    
    onStateChange({
      ...state,
      analysis: {
        ...analysis,
        messages: [
          ...messages,
          userMessage,
          { id: aiMessageId, text: '', sender: 'ai' as const }
        ]
      }
    });

    setIsStreaming(true);
    streamController.current = new AbortController();

    try {
      await askQuestion(
        fileId, 
        text, 
        (word) => {
          onStateChange(prev => ({
            ...prev,
            analysis: {
              ...prev.analysis,
              messages: prev.analysis.messages.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, text: msg.text + (msg.text ? " " : "") + word }
                  : msg
              )
            }
          }));
        },
        streamController.current.signal
      );
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to get response');
        onStateChange(prev => ({
          ...prev,
          analysis: {
            ...prev.analysis,
            messages: prev.analysis.messages.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: "Sorry, I couldn't process your request." }
                : msg
            )
          }
        }));
      }
    } finally {
      setIsStreaming(false);
      streamController.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (streamController.current) {
      streamController.current.abort();
      setIsStreaming(false);
      streamController.current = null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      {showReplaceConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Replace File?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to replace the current file? All analysis results and chat history will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelReplace}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplace}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
              >
                Replace File
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:col-span-2 space-y-8">
        {!file ? (
          <FileUpload onFileUpload={handleSpreadsheetUpload} />
        ) : (
          <div className="animate-fadeIn">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Uploaded File:</p>
                  <p className="text-sm text-green-600">{file.name}</p>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={handleReplaceSpreadsheet}
                >
                  Replace File
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
  <p className="font-medium">Analysis Results:</p>
  {isAnalyzing ? (
    <p className="text-sm text-gray-500">Analyzing...</p>
  ) : analysisResult ? (
    <div className="text-sm text-gray-700">
      <ReactMarkdown
        components={{
          strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
          em: ({node, ...props}) => <em className="italic" {...props} />,
          code: ({node, ...props}) => (
            <code 
              className="bg-gray-100 px-1 rounded font-mono text-xs" 
              {...props} 
            />
          ),
          p: ({node, ...props}) => <p className="mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
        }}
      >
        {analysisResult}
      </ReactMarkdown>
    </div>
  ) : (
    <p className="text-sm text-gray-500">Your analysis output will appear here.</p>
  )}
</div>

            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[400px]">
  {Object.keys(generatedCharts).length > 0 ? (
    <div className="relative h-full">
      {/* Vertical scroll container for charts */}
      <div className="overflow-y-auto h-full max-h-[600px] pr-4 -mr-4">
        <div className="space-y-6">
          {Object.entries(generatedCharts).map(([chartName, chartData]) => (
            <div 
              key={chartName} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow relative"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => downloadChart(chartName, chartData)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs shadow-md"
                  title="Download chart"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
              
              <div className="mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-center font-medium text-lg text-gray-800">
                  {chartName.replace(/_/g, ' ').toUpperCase()}
                </h3>
              </div>
              
              <div className="flex justify-center p-2 bg-gray-50 rounded">
                <img
                  src={chartData}
                  alt={`${chartName} chart`}
                  className="max-w-full h-auto object-contain"
                  onError={(e) => {
                    console.error(`Error loading chart: ${chartName}`);
                    toast.error(`Failed to load ${chartName} chart`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
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
          'All possible Charts will appear here'
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
          onSampleSizeChange={handleSampleSizeChange}
          onAnalyze={handleAnalyze}
          onGenerate={handleGenerate}
          isAnalyzing={isAnalyzing}
          isGenerating={isGenerating}
        />

        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onStopStreaming={handleStopStreaming}
        />
      </div>
    </div>
  );
};