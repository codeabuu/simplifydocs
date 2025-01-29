import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askGPT } from '@/lib/api'; // Import the general AI API

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface GeneralChatInterfaceProps {
  onSendMessage: (message: string) => void;
}

export const GeneralChatInterface = ({ onSendMessage }: GeneralChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'ai' }
  ]);

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage = { id: messages.length + 1, text: message, sender: 'user' as const };
      setMessages([...messages, newMessage]);
      setMessage('');

      try {
        // Call the backend API for general AI queries
        const response = await askGPT(message);

        // Log the response for debugging
        console.log("Backend Response:", response);

        // Ensure the response has the correct key
        const aiMessage = { id: messages.length + 2, text: response.response, sender: 'ai' as const };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage = { id: messages.length + 2, text: "Failed to get a response. Please try again.", sender: 'ai' as const };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-medium">GPT-4</h3>
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
            placeholder="Ask a general question..."
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