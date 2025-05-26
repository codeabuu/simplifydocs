import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Brain, User, LogOut, CreditCard, Lock } from 'lucide-react';
import { SpreadsheetAnalysis } from '@/components/spreadsheetMain';
import { PdfProcessing } from '@/components/pdfMain';
import { GeneralChatInterface } from '@/components/generalChat';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface SpreadsheetState {
  file: File | null;
  fileId: string | null;
  analysis: {
    sampleSize: number;
    analysisResult: string | null;
    generatedCharts: Record<string, string>;
    messages: Array<{ id: string; text: string; sender: 'user' | 'ai' }>;
  };
}

interface PdfState {
  file: File | null;
  fileId: string | null;
  generatedPdfUrl: string | null;
  messages: Array<{ id: string; text: string; sender: 'user' | 'ai' }>;
  processingStatus: string | null;
}

const Dashboard = () => {
  // Spreadsheet state
  const [spreadsheetState, setSpreadsheetState] = useState<SpreadsheetState>(() => {
    const saved = sessionStorage.getItem('spreadsheetState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.file) {
          const file = new File([], parsed.file.name, { type: parsed.file.type });
          Object.defineProperty(file, 'size', { value: parsed.file.size });
          return { ...parsed, file };
        }
      } catch (e) {
        console.error('Failed to load spreadsheet state', e);
        sessionStorage.removeItem('spreadsheetState');
      }
    }
    return {
      file: null,
      fileId: null,
      analysis: {
        sampleSize: 100,
        analysisResult: null,
        generatedCharts: {},
        messages: [{ id: uuidv4(), text: "Hello! Ask me about your data.", sender: 'ai' }]
      }
    };
  });

  // PDF state
  const [pdfState, setPdfState] = useState<PdfState>(() => {
    const saved = sessionStorage.getItem('pdfState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.file) {
          const file = new File([], parsed.file.name, { type: parsed.file.type });
          Object.defineProperty(file, 'size', { value: parsed.file.size });
          return { 
            ...parsed, 
            file,
            processingStatus: null // Reset status on reload
          };
        }
      } catch (e) {
        console.error('Failed to load PDF state', e);
        sessionStorage.removeItem('pdfState');
      }
    }
    return {
      file: null,
      fileId: null,
      generatedPdfUrl: null,
      messages: [{ id: uuidv4(), text: "Hello! Ask me about your PDF.", sender: 'ai' }],
      processingStatus: null
    };
  });

  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Persist spreadsheet state
  useEffect(() => {
    if (spreadsheetState.fileId) {
      const { file, ...rest } = spreadsheetState;
      const toSave = {
        ...rest,
        file: file ? { name: file.name, type: file.type, size: file.size } : null
      };
      sessionStorage.setItem('spreadsheetState', JSON.stringify(toSave));
    }
  }, [spreadsheetState]);

  // Persist PDF state
  useEffect(() => {
    if (pdfState.fileId || pdfState.generatedPdfUrl) {
      const { file, ...rest } = pdfState;
      const toSave = {
        ...rest,
        file: file ? { name: file.name, type: file.type, size: file.size } : null
      };
      sessionStorage.setItem('pdfState', JSON.stringify(toSave));
    }
  }, [pdfState]);

  useEffect(() => {
    window.scrollTo(0, 0);
    checkSubscription();
  }, [navigate]);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/check-subscription-status/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setHasSubscription(response.data.has_active_subscription);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
      setHasSubscription(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Spreadsheet handlers
  const handleSpreadsheetFileUpload = (file: File, fileId: string) => {
    setSpreadsheetState({
      ...spreadsheetState,
      file,
      fileId,
      analysis: {
        ...spreadsheetState.analysis,
        analysisResult: null,
        generatedCharts: {}
      }
    });
  };

  const handleSpreadsheetReset = () => {
    setSpreadsheetState({
      file: null,
      fileId: null,
      analysis: {
        sampleSize: 100,
        analysisResult: null,
        generatedCharts: {},
        messages: [{ id: uuidv4(), text: "Hello! Ask me about your data.", sender: 'ai' }]
      }
    });
    sessionStorage.removeItem('spreadsheetState');
  };

  // PDF handlers
  const handlePdfFileUpload = (file: File, fileId: string) => {
    setPdfState({
      ...pdfState,
      file,
      fileId,
      generatedPdfUrl: null,
      processingStatus: null
    });
  };

  const handlePdfReset = () => {
    if (pdfState.generatedPdfUrl) {
      URL.revokeObjectURL(pdfState.generatedPdfUrl);
    }
    setPdfState({
      file: null,
      fileId: null,
      generatedPdfUrl: null,
      messages: [{ id: uuidv4(), text: "Hello! Ask me about your PDF.", sender: 'ai' }],
      processingStatus: null
    });
    sessionStorage.removeItem('pdfState');
  };

  const handleLogoutConfirm = () => {
    // Clean up object URLs
    if (pdfState.generatedPdfUrl) {
      URL.revokeObjectURL(pdfState.generatedPdfUrl);
    }
    
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('spreadsheetState');
    sessionStorage.removeItem('pdfState');
    navigate('/login');
  };

  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold">Confirm Logout</h3>
          <p className="text-gray-600">
            Are you sure you want to sign out? You'll need to log back in to continue.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleLogoutConfirm}>
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
  
      <div className="bg-white shadow-sm relative z-50">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">AskAnalytIQ: AI That Reads Between the Lines</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User className="h-6 w-6 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pricing')}>
                <CreditCard className="h-4 w-4 mr-2" />
                {hasSubscription ? 'Manage Subscription' : 'Upgrade Plan'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowLogoutModal(true)}
                className="text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={`${!hasSubscription ? 'blur-sm brightness-75 pointer-events-none' : ''}`}>
        <div className="container py-8">
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
              <TabsTrigger value="spreadsheet" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Spreadsheet Analysis
              </TabsTrigger>
              <TabsTrigger value="pdf" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                PDF Processing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="spreadsheet" className="space-y-8">
              <SpreadsheetAnalysis
                state={spreadsheetState}
                onStateChange={setSpreadsheetState}
                onFileUpload={handleSpreadsheetFileUpload}
                onReset={handleSpreadsheetReset}
              />
            </TabsContent>

            <TabsContent value="pdf" className="space-y-8">
              <PdfProcessing
                state={pdfState}
                onStateChange={setPdfState}
                onFileUpload={handlePdfFileUpload}
                onReset={handlePdfReset}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {!hasSubscription && !isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <Card className="w-full max-w-md p-8 text-center relative z-50">
            <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Features Locked</h2>
            <p className="text-gray-600 mb-6">
              You need an active subscription to access AskAnalytIQ AI Tool.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/pricing')} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
              <Button variant="outline" onClick={() => setShowLogoutModal(true)} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showLogoutModal && createPortal(<LogoutModal />, document.body)}
    </div>
  );
};

export default Dashboard;