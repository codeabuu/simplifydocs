import { ScrollArea } from "@/components/ui/scroll-area";

interface PdfPreviewProps {
  pdfUrl: string | null;
}

export const PdfPreview = ({ pdfUrl }: PdfPreviewProps) => {
  if (!pdfUrl) {
    return (
      <div className="h-[600px] bg-white rounded-lg shadow-sm flex items-center justify-center">
        <p className="text-gray-500">PDF preview will appear here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] bg-white rounded-lg shadow-sm">
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Preview"
      />
    </ScrollArea>
  );
};