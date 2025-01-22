import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askQuestion } from '@/lib/api'; // Import the askQuestion API

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatInterfaceProps {
  fileId: string | null; // Add fileId prop
  onSendMessage: (message: string) => void;
}

export const ChatInterface = ({ fileId, onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! Ask me anything about your spreadsheet.", sender: 'ai' }
  ]);

  const handleSend = async () => {
    if (message.trim() && fileId) {
      const newMessage = { id: messages.length + 1, text: message, sender: 'user' as const };
      setMessages([...messages, newMessage]);
      setMessage('');

      try {
        // Call the backend API to ask a question
        const response = await askQuestion(fileId, message);
        const aiMessage = { id: messages.length + 2, text: response.answer, sender: 'ai' as const };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = { id: messages.length + 2, text: "Failed to get a response. Please try again.", sender: 'ai' as const };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-medium">Chat with your Data</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
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
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};