import { useState, useEffect, useRef } from 'react';
import { Send, Square } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
}

export const ChatInterface = ({ 
  messages,
  onSendMessage,
  isStreaming = false,
  onStopStreaming = () => {}
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
    
    if (!isNearBottom && !userScrolledUp.current) {
      clearTimeout(scrollTimeout.current);
      userScrolledUp.current = true;
    } 
    else if (isNearBottom && userScrolledUp.current) {
      userScrolledUp.current = false;
    }
  };

  const smartScroll = () => {
    if (userScrolledUp.current || !scrollAreaRef.current) return;
    
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  };

  useEffect(() => {
    if (isStreaming) {
      scrollTimeout.current = setTimeout(smartScroll, 300);
    } else {
      smartScroll();
    }

    return () => clearTimeout(scrollTimeout.current);
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      userScrolledUp.current = false;
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-medium">Chat with your Data</h3>
      </div>

      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`prose prose-sm max-w-[80%] rounded-lg p-3 ${
                msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.sender === 'ai' ? (
                  <ReactMarkdown
                    components={{
                      strong: ({node, ...props}) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      em: ({node, ...props}) => (
                        <em className="italic" {...props} />
                      ),
                      code: ({node, ...props}) => (
                        <code className="bg-gray-200 px-1 rounded font-mono text-sm" {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className="mb-2" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className="list-disc pl-5 mb-3" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="mb-1" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                <div className="flex items-center gap-2">
                  <span>Thinking</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about your data..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          {isStreaming ? (
            <Button 
              onClick={onStopStreaming} 
              size="icon" 
              variant="destructive"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSend} 
              size="icon"
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};