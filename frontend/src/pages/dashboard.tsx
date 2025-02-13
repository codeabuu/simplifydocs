import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { SpreadsheetAnalysis } from '@/components/spreadsheetMain';
import { PdfProcessing } from '@/components/pdfMain';
import { GeneralChatInterface } from '@/components/generalChat';

const Index = () => {
  const [fileId, setFileId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Document Analysis Tool</h1>

        {/* General AI Chat Section */}
        <Card className="mb-8">
          <div className="p-4 border-b flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Ask Me Anything</h2>
          </div>
          <div className="p-4">
            <GeneralChatInterface />
          </div>
        </Card>

        <Tabs defaultValue="spreadsheet" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spreadsheet">Spreadsheet Analysis</TabsTrigger>
            <TabsTrigger value="pdf">PDF Processing</TabsTrigger>
          </TabsList>

          {/* Spreadsheet Tab */}
          <TabsContent value="spreadsheet" className="space-y-8">
            <SpreadsheetAnalysis
              fileId={fileId}
              setFileId={setFileId}
            />
          </TabsContent>

          {/* PDF Tab */}
          <TabsContent value="pdf" className="space-y-8">
            <PdfProcessing />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;