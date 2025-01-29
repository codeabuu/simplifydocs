import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfUpload } from '@/components/PdfUpload';
import { PdfControls } from '@/components/PdfControls';
import { toast } from 'sonner';
import { askCustom, summarizePdf, uploadPdf } from '@/lib/api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const PdfProcessing = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const handlePdfUpload = async (file: File) => {
    try {
      setIsProcessingPdf(true);
      const response = await uploadPdf(file);
      setPdfFile(file);
      setFileId(response.file_id);
      toast.success('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleReplacePdf = () => {
    setPdfFile(null);
    setFileId(null);
    setGeneratedPdfUrl(null);
  };

  const handleSummaryType = async (type: string) => {
    if (!fileId) {
      toast.error('No PDF uploaded yet');
      return;
    }

    try {
      setIsProcessingPdf(true);
      const blob = await summarizePdf(fileId, type);
      console.log("Blob:", blob);

      const pdfUrl = URL.createObjectURL(blob);
      console.log("PDF URL:", pdfUrl);

      setGeneratedPdfUrl(pdfUrl); // Set the URL for the generated PDF
      toast.success('Generated PDF successfully!');
    } catch (error) {
      console.error('Error generating PDF output:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleCustomPrompt = async (prompt: string) => {
    if (!fileId) {
      toast.error('No PDF uploaded yet');
      return;
    }

    try {
      setIsProcessingPdf(true);

      // Convert the response to a Blob and create a URL
      const blob = await askCustom(fileId, prompt);
      const pdfUrl = URL.createObjectURL(blob);
      setGeneratedPdfUrl(pdfUrl); // Set the URL for the generated PDF
      toast.success('Custom prompt processed successfully!');
    } catch (error) {
      console.error('Error processing custom prompt:', error);
      toast.error('Failed to process custom prompt');
    } finally {
      setIsProcessingPdf(false);
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        {!pdfFile ? (
          <PdfUpload onFileUpload={handlePdfUpload} />
        ) : (
          <div className="animate-fadeIn">
            {/* Uploaded File Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="font-medium">Uploaded File:</p>
              <p className="text-sm text-gray-500">{pdfFile.name}</p>
              <button
                className="text-sm text-blue-600 mt-2"
                onClick={handleReplacePdf}
              >
                Replace File
              </button>
            </div>

            {/* Generated PDF Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[400px] overflow-auto">
              {isProcessingPdf ? (
                <p className="text-sm text-gray-500">Processing...</p>
              ) : generatedPdfUrl ? (
                <div className="mt-4">
                  <Document
                    file={generatedPdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error("Failed to load PDF:", error)}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={800}
                        className="mb-4"
                      />
                    ))}
                  </Document>
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
      </div>
    </div>
  );
};