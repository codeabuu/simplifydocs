import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { uploadSpreadsheet } from '@/lib/api'; // Adjust the import path as needed

interface FileUploadProps {
  onFileUpload: (file: File, fileId: string) => void; // Update to accept fileId instead of File
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'text/csv') {
        try {
          const response = await uploadSpreadsheet(file);
          onFileUpload(file, response.file_id); // Pass the fileId to the parent component
          toast.success('File uploaded successfully!');
        } catch (error) {
          toast.error('Failed to upload file. Please try again.');
        }
      } else {
        toast.error('Please upload a valid spreadsheet file');
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
      `}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <div className="text-center">
          <p className="text-lg font-medium">Drag & drop your spreadsheet here</p>
          <p className="text-sm text-gray-500">or click to select file</p>
        </div>
        <p className="text-xs text-gray-400">Supports XLSX, XLS, CSV</p>
      </div>
    </div>
  );
};