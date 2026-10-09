import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/BrandLogo';
import aiService from '@/services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm IPNIA's AI assistant 🤖 I can help you choose the perfect AI course and guide you through your learning journey! What's your background?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.getAIResponse(inputValue.trim());

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close chat' : 'Open IPNIA assistant'}
          className={cn(
            "h-16 w-16 rounded-full p-0 shadow-[0_12px_36px_rgba(0,0,0,0.45)] transition-all duration-300 hover:scale-110",
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "border-2 border-[#e2b552] bg-[#0a1628] hover:border-[#e0b96a] hover:bg-[#0c1a2e]"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <BrandLogo size={40} className="shrink-0" title="IPNIA" markOnly />
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 h-[500px] w-96">
          <Card className="flex h-full flex-col border-2 border-[#e2b552]/30 bg-[#0c1a2e] text-white shadow-2xl">
            <CardContent className="flex h-full flex-col p-0">
              <div className="rounded-t-lg border-b border-[#e2b552]/25 bg-[#0a1628] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#e2b552]/40 bg-[#07111f]">
                    <BrandLogo size={28} title="IPNIA" markOnly />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">IPNIA AI Assistant</h3>
                    <p className="text-sm text-[#e2b552]/90">Online • Ready to help</p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e2b552]/30 bg-[#07111f]">
                          <BrandLogo size={22} title="IPNIA" markOnly />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.sender === 'user'
                            ? "bg-[#e2b552] text-[#0a1628]"
                            : "bg-white/10 text-white"
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#e2b552]">
                          <User className="h-4 w-4 text-[#0a1628]" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#e2b552]/30 bg-[#07111f]">
                        <BrandLogo size={22} title="IPNIA" markOnly />
                      </div>
                      <div className="rounded-lg bg-white/10 p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-[#e2b552]" />
                          <span className="text-sm text-white/80">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 border-white/15 bg-[#07111f] text-white placeholder:text-white/40"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="bg-[#e2b552] text-[#0a1628] hover:bg-[#e0b96a]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
