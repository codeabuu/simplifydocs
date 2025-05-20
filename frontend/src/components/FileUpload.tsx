import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { uploadSpreadsheet } from '@/lib/api';

interface FileUploadProps {
  onFileUpload: (file: File, fileId: string) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        
        if (
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'text/csv'
        ) {
          setIsUploading(true);
          setUploadProgress(0);
          
          try {
            const response = await uploadSpreadsheet(file, (progress) => {
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
          toast.error('Please upload a valid spreadsheet file (XLSX, XLS, CSV)');
        }
      }

      if (fileRejections.length > 0) {
        toast.error('Invalid file type. Please upload a spreadsheet file.');
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
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
        <Upload className={`w-12 h-12 ${
          isUploading ? 'text-primary animate-pulse' : 'text-gray-400'
        }`} />
        
        <div className="text-center">
          <p className="text-lg font-medium">
            {isUploading ? (
              `Uploading ${fileName}`
            ) : (
              'Drag & drop your spreadsheet here'
            )}
          </p>
          <p className="text-sm text-gray-500">
            {isUploading ? 'Please wait...' : 'or click to select file'}
          </p>
        </div>
        
        {!isUploading && (
          <p className="text-xs text-gray-400">Supports XLSX, XLS, CSV</p>
        )}
        
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