import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Minimize2, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const DEEPSEEK_API_URL = 'https://f1a0-43-252-217-181.ngrok-free.app';

export function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('aiChatSidebarOpen');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    localStorage.setItem('aiChatSidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    // Initial 2-second interval
    let currentInterval = 2000;
    
    const moveIcon = () => {
      setPosition(Math.random() * 20 - 10);
      setTimeout(() => setPosition(0), 1000);
    };

    let interval = setInterval(moveIcon, currentInterval);

    setTimeout(() => {
      clearInterval(interval);
      currentInterval = 5000;
      interval = setInterval(moveIcon, currentInterval);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getInitialMessage = () => {
      switch (location.pathname) {
        case '/dashboard':
          return "I can help you analyze your trading performance and suggest improvements. What would you like to know about your portfolio?";
        case '/trade':
          return "I can assist with market analysis, risk assessment, and trading strategies. What would you like to know about the current market?";
        case '/social':
          return "I can help you find suitable traders to follow and analyze their performance. What type of trading style are you interested in?";
        case '/':
        case '/profile':
          return "Welcome! I'm your AI trading assistant. How can I help you today?";
        default:
          return "How can I assist you with your trading today?";
      }
    };

    // Always show initial message when route changes
    const initialMessage = {
      id: Date.now().toString(),
      type: 'ai' as const,
      content: getInitialMessage(),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFallbackResponse = (userInput: string, path: string) => {
    const input = userInput.toLowerCase();
    
    if (path === '/dashboard' && input.includes('performance')) {
      return "I apologize, but I'm currently having trouble connecting to get the latest data. However, I can help you analyze your trading performance once the connection is restored.";
    }
    if (path === '/trade' && input.includes('market')) {
      return "I'm currently unable to fetch real-time market data. Please try again in a few moments, or you can check your trading platform directly for the latest market information.";
    }
    return "I apologize, but I'm having trouble connecting to our AI service at the moment. Please try again in a few moments. Is there anything specific you'd like to know about once the service is back up?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          context: location.pathname
        })
      });
      
      if (!response.ok) {
        throw new Error(`API response not ok: ${response.status}`);
      }

      const data = await response.json();
      setIsApiError(false);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setIsApiError(true);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: getFallbackResponse(input, location.pathname),
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    localStorage.setItem('aiChatSidebarOpen', JSON.stringify(!isOpen));
  };

  const styles = {
    minimizedChat: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#007bff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `translateX(${position}px)`,
      '&:hover': {
        transform: `translateX(${position}px) scale(1.1)`,
      },
    },
    chatIcon: {
      width: '24px',
      height: '28px',
      animation: 'float 6s ease-in-out infinite',
      '@keyframes float': {
        '0%, 100%': { 
          transform: 'translateY(0)',
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '50%': { 
          transform: 'translateY(-15px)',
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        toggleChat();
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div 
        style={{
          ...styles.minimizedChat,
          zIndex: 1000, // Ensure it's above other elements
        }}
        onClick={toggleChat}
      >
        <div style={styles.chatIcon}>
          <Bot className="h-6 w-6 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed right-0 bottom-0 bg-gray-800/95 backdrop-blur-sm border-l border-gray-700/50 z-[1000]`}
      style={{
        height: isOpen ? 'calc(100vh - 5rem)' : '50px',
        width: isOpen ? '384px' : '50px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'bottom',
      }}
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
                onClick={toggleChat}
                className="text-gray-400 hover:text-white transition"
                title="Close sidebar (Ctrl + /)"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white transition"
              title="Open sidebar (Ctrl + /)"
            >
              <Minimize2 className="h-5 w-5" />
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
