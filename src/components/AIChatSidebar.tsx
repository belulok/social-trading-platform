import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('aiChatSidebarOpen');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('aiChatSidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('aiChatMessages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
      return;
    }

    const getInitialMessage = () => {
      switch (location.pathname) {
        case '/dashboard':
          return "I can help you analyze your trading performance and suggest improvements. What would you like to know about your portfolio?";
        case '/trade':
          return "I can assist with market analysis, risk assessment, and trading strategies. What would you like to know about the current market?";
        case '/social':
          return "I can help you find suitable traders to follow and analyze their performance. What type of trading style are you interested in?";
        default:
          return "How can I assist you with your trading today?";
      }
    };

    setMessages([{
      id: '1',
      type: 'ai',
      content: getInitialMessage(),
      timestamp: new Date()
    }]);
  }, [location.pathname]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getContextAwareResponse(input, location.pathname);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const getContextAwareResponse = (userInput: string, path: string) => {
    const input = userInput.toLowerCase();
    
    if (path === '/dashboard') {
      if (input.includes('performance')) {
        return "Your trading performance has been strong with a 64% win rate. Your best performing strategy is trend following with major currency pairs. Would you like specific recommendations for improvement?";
      }
      if (input.includes('risk')) {
        return "Your current risk metrics are within healthy ranges. Your max drawdown is 15.3% and your risk-reward ratio averages 1:2.5. Consider setting tighter stop losses on volatile pairs.";
      }
    }
    
    if (path === '/trade') {
      if (input.includes('analysis')) {
        return "Based on current market conditions, BTC/USD shows strong support at $47,200. Key resistance levels are at $48,500 and $49,200. RSI indicates slightly overbought conditions.";
      }
      if (input.includes('strategy')) {
        return "Given the current trend and volatility, a breakout strategy might be effective. Consider waiting for a clear break above $48,500 with volume confirmation.";
      }
    }
    
    if (path === '/social') {
      if (input.includes('recommend')) {
        return "Based on your trading style, I recommend following Jacynth Tham. She has a similar risk profile and consistently outperforms the market with a 78% win rate.";
      }
      if (input.includes('compare')) {
        return "Compared to your trading style, Alex Thompson takes more aggressive positions but has better risk management. His strategies might complement your portfolio.";
      }
    }
    
    return "I understand you're asking about " + userInput + ". Could you please provide more specific details about what you'd like to know?";
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  return (
    <div 
      className={`fixed right-0 top-0 bottom-0 bg-gray-800/95 backdrop-blur-sm border-l border-gray-700/50 transition-all duration-300 z-50 ${
        isOpen ? 'w-96' : 'w-12'
      }`}
      style={{ marginTop: '5rem' }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-16 border-b border-gray-700/50 flex items-center justify-between px-4 flex-shrink-0">
          {isOpen ? (
            <>
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-indigo-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition"
                title="Close sidebar (Ctrl + /)"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-400 hover:text-white transition"
              title="Open sidebar (Ctrl + /)"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {isOpen && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-2"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}