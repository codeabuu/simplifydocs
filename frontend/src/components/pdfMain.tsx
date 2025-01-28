import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf'; // Import react-pdf components
import { PdfUpload } from '@/components/PdfUpload';
import { PdfControls } from '@/components/PdfControls';
import { toast } from 'sonner';
import { askCustom, summarizePdf, uploadPdf } from '@/lib/api';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfProcessingProps {
  onCustomPrompt: (prompt: string) => Promise<void>;
  onDownload: () => void;
  onSummaryType: (type: string) => void;
  fileId: string | null;
}

export const PdfProcessing = ({
  onCustomPrompt,
  onDownload,
  onSummaryType
}: PdfProcessingProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null); // URL for the generated PDF
  const [fileId, setFileId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null); // Number of pages in the generated PDF

  const handlePdfUpload = async (file: File) => {
    try {
      setIsProcessingPdf(true);
      const response = await uploadPdf(file); // Upload the PDF
      setPdfFile(file);
      setFileId(response.file_id); // Set the fileId from the response
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

  const handleSummarizePdf = async (type: string) => {
    if (!fileId) {
      toast.error('No PDF uploaded yet');
      return;
    }

    try {
      setIsProcessingPdf(true);
      const response = await summarizePdf(fileId, type); // Call API to generate PDF content/output

      // Assuming the backend returns a URL to the generated PDF
      setGeneratedPdfUrl(response.generatedPdfUrl); // Set the URL for the generated PDF
      toast.success('Generated PDF successfully!');
    } catch (error) {
      console.error('Error generating PDF output:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleAskPdf = async (prompt: string) => {
    if (!fileId) {
      toast.error('No PDF uploaded yet');
      return;
    }

    try {
      setIsProcessingPdf(true);
      const response = await askCustom(fileId, prompt); // Call ask API with the custom prompt

      // Assuming the backend returns a URL to the generated PDF
      setGeneratedPdfUrl(response.generatedPdfUrl); // Set the URL for the generated PDF
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
    // Download logic here
    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = 'generated-pdf.pdf';
    link.click();
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages); // Set the number of pages in the generated PDF
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
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-medium">Generated PDF:</p>
              {isProcessingPdf ? (
                <p className="text-sm text-gray-500">Processing...</p>
              ) : generatedPdfUrl ? (
                <div className="mt-4">
                  <Document
                    file={generatedPdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={800} // Adjust width as needed
                        className="mb-4"
                      />
                    ))}
                  </Document>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Your generated PDF will appear here.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <PdfControls
          onCustomPrompt={onCustomPrompt}
          onDownload={handleDownload}
          onSummaryType={onSummaryType}
          fileId={fileId}
        />
      </div>
    </div>
  );
};