import { useState } from 'react';
import { PdfUpload } from '@/components/PdfUpload';
import { PdfControls } from '@/components/PdfControls';
import { PdfPreview } from '@/components/PdfPreview';
import { toast } from 'sonner';
import { askCustom } from '@/lib/api';

export const PdfProcessing = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfFileId, setPdfFileId] = useState<string | null>(null); // PDF-specific fileId

  const handlePdfUpload = async (file: File) => {
    setIsProcessingPdf(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call the upload endpoint
      const response = await uploadPdf(formData); // Assuming `uploadPdf` is your API function
      setPdfFile(file);
      setPdfFileId(response.file_id); // Set the PDF fileId
      setPdfPreviewUrl(URL.createObjectURL(file));
      toast.success('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleSummaryType = async (type: string) => {
    if (!pdfFileId) {
      toast.error('Please upload a PDF first');
      return;
    }
    setIsProcessingPdf(true);
    try {
      // Call your API to generate the summary based on the type
      const response = await generateSummary(pdfFileId, type); // Assuming `generateSummary` is your API function
      toast.success(`${type} summary generated!`);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleCustomPrompt = async (prompt: string) => {
    if (!pdfFileId) {
      toast.error('Please upload a PDF first');
      return;
    }
    setIsProcessingPdf(true);
    try {
      // Call the custom prompt endpoint
      const response = await askCustom(pdfFileId, prompt); // Use the PDF-specific fileId
      toast.success('Custom processing complete!');
    } catch (error) {
      console.error('Error processing custom prompt:', error);
      toast.error('Failed to process custom prompt');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleDownload = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = 'processed.pdf';
      link.click();
    }
  };

  return (
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
  );
};