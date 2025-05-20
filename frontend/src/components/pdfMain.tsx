import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfUpload } from '@/components/PdfUpload';
import { PdfControls } from '@/components/PdfControls';
import { PdfChatInterface } from '@/components/PdfChatInterface';
import { toast } from 'sonner';
import { askCustom, summarizePdf, uploadPdf } from '@/lib/api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useEffect } from 'react';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface PdfProcessingProps {
  state: {
    file: File | null;
    fileId: string | null;
    generatedPdfUrl: string | null;
    messages: Array<{ id: string; text: string; sender: 'user' | 'ai' }>;
  };
  onStateChange: (state: any) => void;
  onFileUpload: (file: File, fileId: string) => void;
  onReset: () => void;
}

export const PdfProcessing = ({
  state,
  onStateChange,
  onFileUpload,
  onReset
}: PdfProcessingProps) => {
  const { file, fileId, generatedPdfUrl, messages } = state;
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handlePdfUpload = async (file: File) => {
    try {
      setIsProcessingPdf(true);
      const response = await uploadPdf(file);
      onFileUpload(file, response.file_id);
      toast.success('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleReplacePdf = () => {
    onReset();
  };

  const handleSummaryType = async (type: string) => {
    if (!fileId) {
      toast.error('No PDF uploaded yet');
      return;
    }

    try {
      setIsProcessingPdf(true);
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setStatus('Processing...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setStatus('Generating PDF...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setStatus('Finishing...');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('Uploading...(This might take upto 1 minute)');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const blob = await summarizePdf(fileId, type, { signal });
      const pdfUrl = URL.createObjectURL(blob);
      
      onStateChange({
        ...state,
        generatedPdfUrl: pdfUrl
      });
      
      setStatus('Done!');
      toast.success('Generated PDF successfully!');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was canceled by the user.');
        toast.info('Processing canceled.');
      } else {
        console.error('Error generating PDF output:', error);
        toast.error('Failed to generate PDF');
      }
    } finally {
      setIsProcessingPdf(false);
      abortControllerRef.current = null;
      setStatus(null);
    }
  };

  const handleCustomPrompt = async (prompt: string) => {
    if (!fileId) {
      toast.error('No PDF uploaded yet');
      return;
    }

    try {
      setIsProcessingPdf(true);
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setStatus('Processing...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setStatus('Generating PDF...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setStatus('Finishing...');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('Uploading...(This might take upto 1 minute)');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const blob = await askCustom(fileId, prompt, { signal });
      const pdfUrl = URL.createObjectURL(blob);
      
      onStateChange({
        ...state,
        generatedPdfUrl: pdfUrl
      });
      
      setStatus('Done!');
      toast.success('Custom prompt processed successfully!');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was canceled by the user.');
        toast.info('Processing canceled.');
      } else {
        console.error('Error processing custom prompt:', error);
        toast.error('Failed to process custom prompt');
      }
    } finally {
      setIsProcessingPdf(false);
      abortControllerRef.current = null;
      setStatus(null);
    }
  };

  const handleDownload = () => {
    if (!generatedPdfUrl) {
      toast.error('No generated PDF available to download');
      return;
    }
    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = 'generated-pdf.pdf';
    link.click();
  };

  const handleCancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessingPdf(false);
      setStatus(null);
      toast.info('Processing canceled.');
    }
  };

  const handleNewMessage = (message: { id: string; text: string; sender: 'user' | 'ai' }) => {
    onStateChange({
      ...state,
      messages: [...messages, message]
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        {!file ? (
          <PdfUpload onFileUpload={handlePdfUpload} />
        ) : (
          <div className="animate-fadeIn">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="font-medium">Uploaded File:</p>
              <p className="text-sm text-gray-500">{file.name}</p>
              <button
                className="text-sm text-blue-600 mt-2"
                onClick={handleReplacePdf}
              >
                Replace File
              </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[400px] overflow-auto">
              {isProcessingPdf ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{status || 'Processing...'}</p>
                  <button
                    className="text-sm text-red-600 hover:text-red-700"
                    onClick={handleCancelProcessing}
                  >
                    Cancel
                  </button>
                </div>
              ) : generatedPdfUrl ? (
                <div className="mt-4">
                  <iframe
                    src={generatedPdfUrl}
                    width="100%"
                    height="500px"
                    style={{ border: 'none' }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    Your generated PDF will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <PdfControls
          onCustomPrompt={handleCustomPrompt}
          onDownload={handleDownload}
          onSummaryType={handleSummaryType}
          fileId={fileId}
          isProcessing={isProcessingPdf}
        />

        <PdfChatInterface 
          fileId={fileId} 
          messages={messages}
          onSendMessage={handleCustomPrompt}
          onNewMessage={handleNewMessage}
        />
      </div>
    </div>
  );
};