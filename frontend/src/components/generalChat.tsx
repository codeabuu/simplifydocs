import { useState, useEffect, useRef } from 'react';
import { Send, Square } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { askGPT } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export const GeneralChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! How can I assist you today?", sender: 'ai' }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
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
    } else if (isNearBottom && userScrolledUp.current) {
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

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage = { 
        id: Date.now().toString(), 
        text: message, 
        sender: 'user' as const 
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setIsStreaming(true);
      userScrolledUp.current = false;

      try {
        const response = await askGPT(message);
        const aiMessage = { 
          id: Date.now().toString(), 
          text: response.response, 
          sender: 'ai' as const 
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = { 
          id: Date.now().toString(), 
          text: "Failed to get response. Please try again.", 
          sender: 'ai' as const 
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsStreaming(false);
      }
    }
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
    // Add any additional cleanup for stopping streaming if needed
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-medium">GPT-4</h3>
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
                      h3: ({node, children, ...props}) => {
                        const text = children.toString().replace(/^###\s*/, '');
                        return (
                          <p className="font-semibold text-base mt-4 mb-2 pb-1 border-b border-gray-200" {...props}>
                            {text}
                          </p>
                        );
                      },
                      strong: ({node, ...props}) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className="list-disc pl-5 mb-3" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="mb-1" {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className="mb-2" {...props} />
                      ),
                      code: ({node, ...props}) => (
                        <code className="bg-gray-200 px-1 rounded font-mono text-sm" {...props} />
                      )
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
                  <span className="animate-pulse">...</span>
                  <span>Thinking</span>
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
            placeholder="Ask a general question..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isStreaming}
          />
          {isStreaming ? (
            <Button 
              onClick={handleStopStreaming} 
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