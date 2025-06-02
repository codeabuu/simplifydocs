import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Brain, User, LogOut, CreditCard, Lock, FileText, FileSpreadsheet, HelpCircle, Rocket } from 'lucide-react';
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
import { useLayoutEffect } from 'react';

// IndexedDB Utility Class
class IndexedDB {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, dbVersion: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('spreadsheet')) {
          db.createObjectStore('spreadsheet', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pdf')) {
          db.createObjectStore('pdf', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result?.data);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async setBlob(storeName: string, id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id, blob });

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async getBlob(storeName: string, id: string): Promise<Blob | undefined> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result?.blob);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async set(storeName: string, id: string, data: any): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id, data });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}

const db = new IndexedDB('AskAnalytIQ', 1);

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
  const [spreadsheetState, setSpreadsheetState] = useState<SpreadsheetState>({
    file: null,
    fileId: null,
    analysis: {
      sampleSize: 100,
      analysisResult: null,
      generatedCharts: {},
      messages: [{ id: uuidv4(), text: "Hello! Ask me about your data.", sender: 'ai' }]
    }
  });

  // PDF state
  const [pdfState, setPdfState] = useState<PdfState>({
    file: null,
    fileId: null,
    generatedPdfUrl: null,
    messages: [{ id: uuidv4(), text: "Hello! Ask me about your PDF.", sender: 'ai' }],
    processingStatus: null
  });

  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Load initial state from IndexedDB
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [spreadsheetData, pdfData] = await Promise.all([
          db.get<SpreadsheetState>('spreadsheet', 'current'),
          db.get<PdfState>('pdf', 'current')
        ]);

        if (spreadsheetData) {
          setSpreadsheetState(prev => ({
            ...prev,
            ...spreadsheetData,
            file: spreadsheetData.file 
              ? new File([], spreadsheetData.file.name, { type: spreadsheetData.file.type })
              : null
          }));
        }

        if (pdfData) {
          setPdfState(prev => ({
            ...prev,
            ...pdfData,
            file: pdfData.file 
              ? new File([], pdfData.file.name, { type: pdfData.file.type })
              : null,
            processingStatus: null // Reset status on reload
          }));
        }
      } catch (error) {
        console.error('Failed to load state from IndexedDB', error);
      }
    };

    loadInitialState();
  }, []);

  // Persist spreadsheet state to IndexedDB
  useEffect(() => {
    if (spreadsheetState.fileId) {
      const { file, ...rest } = spreadsheetState;
      const toSave = {
        ...rest,
        file: file ? { name: file.name, type: file.type, size: file.size } : null
      };

      db.set('spreadsheet', 'current', toSave).catch(error => {
        console.error('Failed to save spreadsheet state to IndexedDB', error);
      });
    }
  }, [spreadsheetState]);

  // Persist PDF state to IndexedDB
  useEffect(() => {
    if (pdfState.fileId || pdfState.generatedPdfUrl) {
      const { file, ...rest } = pdfState;
      const toSave = {
        ...rest,
        file: file ? { name: file.name, type: file.type, size: file.size } : null
      };

      db.set('pdf', 'current', toSave).catch(error => {
        console.error('Failed to save PDF state to IndexedDB', error);
      });
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

  const handleSpreadsheetReset = async () => {
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
    
    try {
      await db.delete('spreadsheet', 'current');
    } catch (error) {
      console.error('Failed to delete spreadsheet state from IndexedDB', error);
    }
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

  const handlePdfReset = async () => {
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
    
    try {
      await db.delete('pdf', 'current');
    } catch (error) {
      console.error('Failed to delete PDF state from IndexedDB', error);
    }
  };

  const handleLogoutConfirm = async () => {
    // Clean up object URLs
    if (pdfState.generatedPdfUrl) {
      URL.revokeObjectURL(pdfState.generatedPdfUrl);
    }
    
    localStorage.removeItem('authToken');
    
    try {
      await Promise.all([
        db.delete('spreadsheet', 'current'),
        db.delete('pdf', 'current')
      ]);
    } catch (error) {
      console.error('Failed to clear IndexedDB on logout', error);
    }
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-primary font-medium">Loading your dashboard...</p>
          </div>
        </div>
      )}
  
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AskAnalytIQ
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/help')}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
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
      </header>

      <main className={`container py-8 ${!hasSubscription ? 'blur-sm brightness-75 pointer-events-none' : ''}`}>
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
              <p className="opacity-90 max-w-2xl">
                Get insights from your documents with our AI-powered analysis. 
                Start by uploading a spreadsheet or PDF, or ask our assistant anything.
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="mt-4 md:mt-0 flex items-center gap-2"
              onClick={() => navigate('/tutorial')}
            >
              <Rocket className="h-4 w-4" />
              Quick Tour
            </Button>
          </div>
        </div>

        {/* AI Chat Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
          </div>
          <div className="p-4">
            <GeneralChatInterface />
          </div>
        </Card>

        {/* Document Analysis Tabs */}
        <Tabs defaultValue="spreadsheet" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="spreadsheet" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 data-[state=active]:border-green-500 data-[state=active]:border-b-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Spreadsheets
            </TabsTrigger>
            <TabsTrigger 
              value="pdf" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 data-[state=active]:border-red-500 data-[state=active]:border-b-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              PDF Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spreadsheet">
            <Card className="p-6 shadow-sm border-t-4 border-green-500">
              <SpreadsheetAnalysis
                state={spreadsheetState}
                onStateChange={setSpreadsheetState}
                onFileUpload={handleSpreadsheetFileUpload}
                onReset={handleSpreadsheetReset}
              />
            </Card>
          </TabsContent>

          <TabsContent value="pdf">
            <Card className="p-6 shadow-sm border-t-4 border-red-500">
              <PdfProcessing
                state={pdfState}
                onStateChange={setPdfState}
                onFileUpload={handlePdfFileUpload}
                onReset={handlePdfReset}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Subscription Lock Modal */}
      {!hasSubscription && !isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <Card className="w-full max-w-md p-8 text-center relative z-50 border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Unlock Premium Features</h2>
            <p className="text-gray-600 mb-6">
              Upgrade your plan to access the full power of AskAnalytIQ AI tools and advanced document analysis.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/pricing')} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                View Plans & Upgrade
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLogoutModal(true)} 
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <Card className="w-full max-w-sm p-6 border-0 shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-red-100 p-3 rounded-full">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Confirm Logout</h3>
              <p className="text-gray-600">
                Are you sure you want to sign out? You'll need to log back in to continue.
              </p>
              <div className="flex gap-3 w-full mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1" 
                  onClick={handleLogoutConfirm}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </div>, 
        document.body
      )}
    </div>
  );
};

export default Dashboard;