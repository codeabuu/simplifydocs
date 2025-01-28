import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { uploadPdf } from '@/lib/api';

interface PdfUploadProps {
  onFileUpload: (file: File, fileId: string) => void;
}

export const PdfUpload = ({ onFileUpload }: PdfUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === 'application/pdf') {
          try {
            const response = await uploadPdf(file);
            onFileUpload(file, response.file_id);
            toast.success('PDF uploaded successfully!');
          } catch (error) {
            toast.error('Failed to upload PDF. Please try again.');
          }
        } else {
          toast.error('Please upload a PDF file');
        }
      }

      // Handle file rejection (if any)
      if (fileRejections.length > 0) {
        toast.error('Invalid file type. Please upload a valid PDF file.');
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),  // Set dragging state when entering
    onDragLeave: () => setIsDragging(false),  // Reset dragging state when leaving
    onDropAccepted: () => setIsDragging(false),  // Reset dragging state after drop
    onDropRejected: () => setIsDragging(false),  // Reset dragging state if drop is rejected
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <FileText className="w-12 h-12 text-gray-400" />
        <div className="text-center">
          <p className="text-lg font-medium">Drag & drop your PDF here</p>
          <p className="text-sm text-gray-500">or click to select file</p>
        </div>
      </div>
    </div>
  );
};
