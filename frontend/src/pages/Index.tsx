import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { PdfUpload } from '@/components/PdfUpload';
import { AnalysisConfig } from '@/components/AnalysisConfig';
import { PdfControls } from '@/components/PdfControls';
import { ChatInterface } from '@/components/ChatInterface';
import { PdfPreview } from '@/components/PdfPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { Brain } from 'lucide-react';

const Index = () => {
  // Spreadsheet states
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null); // Store fileId separately
  const [sampleSize, setSampleSize] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // PDF states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  const handleSpreadsheetUpload = (file: File, uploadedFileId: string) => {
    setSpreadsheetFile(file);  // Store the entire file object
    setFileId(uploadedFileId);  // Store the fileId received from the backend
  };

  const handleReplaceSpreadsheet = () => {
    setSpreadsheetFile(null);  // Clear the current file
    setFileId(null);  // Clear the fileId
  };

  const handlePdfUpload = (file: File) => {
    setPdfFile(file);
    setPdfPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!fileId) {
      toast.error('Please upload a spreadsheet first');
      return;
    }
    setIsAnalyzing(true);
    // TODO: Implement your analysis logic here
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    toast.success('Analysis complete!');
  };

  const handleGenerate = async () => {
    if (!fileId) {
      toast.error('Please upload a spreadsheet first');
      return;
    }
    setIsGenerating(true);
    // TODO: Implement your chart generation logic here
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success('Charts generated successfully!');
  };

  const handleSummaryType = async (type: string) => {
    if (!pdfFile) {
      toast.error('Please upload a PDF first');
      return;
    }
    setIsProcessingPdf(true);
    // TODO: Implement your PDF summary logic here
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPdf(false);
    toast.success(`${type} summary generated!`);
  };

  const handleCustomPrompt = async (prompt: string) => {
    if (!pdfFile) {
      toast.error('Please upload a PDF first');
      return;
    }
    setIsProcessingPdf(true);
    // TODO: Implement your custom prompt logic here
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPdf(false);
    toast.success('Custom processing complete!');
  };

  const handleDownload = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = 'processed.pdf';
      link.click();
    }
  };

  const handleGeneralQuestion = async (message: string) => {
    try {
      // TODO: Implement your AI chat logic here
      console.log('Processing general question:', message);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Response received!');
    } catch (error) {
      toast.error('Failed to process your question');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Document Analysis Tool</h1>

        {/* General AI Chat Section */}
        <Card className="mb-8">
          <div className="p-4 border-b flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Ask Me Anything</h2>
          </div>
          <div className="p-4">
            <ChatInterface onSendMessage={handleGeneralQuestion} />
          </div>
        </Card>
        
        <Tabs defaultValue="spreadsheet" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spreadsheet">Spreadsheet Analysis</TabsTrigger>
            <TabsTrigger value="pdf">PDF Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="spreadsheet" className="space-y-8">
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
                    
                    <div className="bg-white p-8 rounded-lg shadow-sm h-[400px] flex items-center justify-center">
                      <p className="text-gray-500">Charts will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <AnalysisConfig
                  sampleSize={sampleSize}
                  onSampleSizeChange={setSampleSize}
                  onAnalyze={handleAnalyze}
                  onGenerate={handleGenerate}
                  isAnalyzing={isAnalyzing}
                  isGenerating={isGenerating}
                />
                
                <ChatInterface onSendMessage={handleCustomPrompt} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {!pdfFile ? (
                  <PdfUpload onFileUpload={handlePdfUpload} />
                ) : (
                  <PdfPreview pdfUrl={pdfPreviewUrl} />
                )}
              </div>

              <div className="space-y-8">
                <PdfControls
                  onSummaryType={handleSummaryType}
                  onCustomPrompt={handleCustomPrompt}
                  onDownload={handleDownload}
                  isProcessing={isProcessingPdf}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
