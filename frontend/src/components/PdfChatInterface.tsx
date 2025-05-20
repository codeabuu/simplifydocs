import { useState, useEffect, useRef } from 'react';
import { Send, Square, Copy, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askPdGPT } from '@/lib/api';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface PdfChatInterfaceProps {
  fileId: string | null;
  onSendMessage: (message: string) => void;
}

export const PdfChatInterface = ({ fileId, onSendMessage }: PdfChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: uuidv4(), text: "Hello! Ask me anything about your PDF.", sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [controller, setController] = useState<AbortController | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load stored messages on mount
  useEffect(() => {
    if (fileId) {
      try {
        const storedMessages = localStorage.getItem(`pdfchat-${fileId}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (e) {
        console.error("Failed to parse stored messages", e);
      }
    }
  }, [fileId]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (fileId) {
      localStorage.setItem(`pdfchat-${fileId}`, JSON.stringify(messages));
    }
  }, [messages, fileId]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCopy = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedMessageId(messageId);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy text');
      });
  };

  const handleSend = async () => {
    if (!fileId) {
      toast.error("Please upload a PDF first.");
      return;
    }

    if (message.trim()) {
      const newMessage = { id: uuidv4(), text: message, sender: 'user' as const };
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      setIsLoading(true);
      setIsStreaming(false);

      const newController = new AbortController();
      setController(newController);

      try {
        const aiMessage = { id: uuidv4(), text: '', sender: 'ai' as const };
        setMessages((prev) => [...prev, aiMessage]);

        await askPdGPT(fileId, message, (word) => {
          setIsStreaming(true);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id ? { ...msg, text: msg.text + ' ' + word } : msg
            )
          );
        }, newController.signal);

      } catch (error) {
        if (error.name !== 'AbortError') {
          const errorMessage = { id: uuidv4(), text: "Failed to get a response.", sender: 'ai' as const };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        setController(null);
      }
    }
  };

  const handleStop = () => {
    if (controller) {
      controller.abort();
      setIsLoading(false);
      setIsStreaming(false);
      setController(null);
    }
  };

  const handleResetChat = () => {
    const introMessage = { id: uuidv4(), text: "Hello! Ask me anything about your PDF.", sender: 'ai' as const };
    setMessages([introMessage]);
    if (fileId) {
      localStorage.removeItem(`pdfchat-${fileId}`);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Chat with your PDF</h3>
        <Button variant="outline" size="sm" onClick={handleResetChat}>
          Reset Chat
        </Button>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`prose prose-sm max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <>
                    <ReactMarkdown
                      components={{
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        code: ({ node, ...props }) => (
                          <code className="bg-gray-200 px-1 rounded font-mono text-sm" {...props} />
                        ),
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        title="Copy message"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {!isStreaming && isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about your PDF..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          {controller ? (
            <Button onClick={handleStop} size="icon" variant="destructive">
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
