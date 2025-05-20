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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        
        if (file.type === 'application/pdf') {
          setIsUploading(true);
          setUploadProgress(0);
          
          try {
            const response = await uploadPdf(file, (progress) => {
              setUploadProgress(progress);
            });

            if (response?.file_id) {
              onFileUpload(file, response.file_id);
              toast.success(`${file.name} uploaded successfully!`);
            } else {
              throw new Error('Invalid response from server');
            }
          } catch (error) {
            console.error('Upload error:', error);
            toast.error(`Failed to upload ${file.name}. Please try again.`);
          } finally {
            setIsUploading(false);
            setTimeout(() => {
              setUploadProgress(0);
              setFileName('');
            }, 1000);
          }
        } else {
          toast.error('Please upload a valid PDF file');
        }
      }

      if (fileRejections.length > 0) {
        toast.error('Invalid file type. Please upload a PDF file.');
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
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg transition-colors ${
        isUploading ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <FileText className={`w-12 h-12 ${
          isUploading ? 'text-primary animate-pulse' : 'text-gray-400'
        }`} />
        
        <div className="text-center">
          <p className="text-lg font-medium">
            {isUploading ? `Uploading ${fileName}` : 'Drag & drop your PDF here'}
          </p>
          <p className="text-sm text-gray-500">
            {isUploading ? 'Please wait...' : 'or click to select file'}
          </p>
        </div>
        
        {isUploading && (
          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-primary">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};