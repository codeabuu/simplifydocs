import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface PdfUploadProps {
  onFileUpload: (file: File) => void;
}

export const PdfUpload = ({ onFileUpload }: PdfUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        onFileUpload(file);
        toast.success('PDF uploaded successfully!');
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
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
        <FileText className="w-12 h-12 text-gray-400" />
        <div className="text-center">
          <p className="text-lg font-medium">Drag & drop your PDF here</p>
          <p className="text-sm text-gray-500">or click to select file</p>
        </div>
      </div>
    </div>
  );
};