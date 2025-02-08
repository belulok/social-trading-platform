import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Clock,
  Percent,
  Bot,
  X,
  Sparkles,
  Brain,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Heart,
  Share2,
  Users,
  Award,
  Newspaper,
  ChevronRight
} from 'lucide-react';
import { CandlestickChart } from '../components/CandlestickChart';

// Mock FAANG stocks data
const faangStocks = [
  {
    symbol: 'META',
    name: 'Meta Platforms Inc',
    price: 485.58,
    change: +1.25,
    volume: '15.2M',
    marketCap: '1.24T'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: 182.52,
    change: -0.68,
    volume: '25.8M',
    marketCap: '2.82T'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    price: 175.35,
    change: +2.15,
    volume: '18.5M',
    marketCap: '1.82T'
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc',
    price: 605.88,
    change: +3.42,
    volume: '8.4M',
    marketCap: '262.5B'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc',
    price: 147.68,
    change: +0.85,
    volume: '12.7M',
    marketCap: '1.85T'
  }
];

// Mock news data
const stockNews = [
  {
    id: 1,
    title: "Meta Reports Strong Q4 Earnings",
    source: "Bloomberg",
    time: "2 hours ago",
    sentiment: "positive",
    impact: "high",
    content: "Meta Platforms Inc. reported fourth-quarter revenue that topped analysts estimates, driven by a rebound in digital advertising and cost cuts. The company also announced its first-ever dividend.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Fed Signals Patience on Rate Cuts",
    source: "Reuters",
    time: "4 hours ago",
    sentiment: "neutral",
    impact: "high",
    content: "Federal Reserve Chair Jerome Powell said the central bank can be \"prudent\" in deciding when to cut interest rates, with officials focused on gaining confidence that inflation is moving sustainably down to 2%.",
    image: "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Tech Sector Faces Regulatory Challenges",
    source: "Wall Street Journal",
    time: "6 hours ago",
    sentiment: "negative",
    impact: "medium",
    content: "Major tech companies are facing increased scrutiny from regulators worldwide, potentially impacting their growth prospects and market valuations.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

// Mock top traders data
const topTraders = [
  {
    id: '1',
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    expertise: ["BTC/USD", "ETH/USD", "SOL/USD"],
    winRate: "78%",
    profitLoss: "+234.5%",
    followers: 1234,
    description: "Specializes in crypto technical analysis with 5+ years of experience",
    tradingStyle: "Swing Trading",
    riskLevel: "Medium",
    performance: {
      monthly: "+45.2%",
      yearly: "+156.8%"
    }
  },
  {
    id: '2',
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    expertise: ["BTC/USD", "ADA/USD", "DOT/USD"],
    winRate: "82%",
    profitLoss: "+189.2%",
    followers: 892,
    description: "Expert in cryptocurrency market analysis and trend following",
    tradingStyle: "Day Trading",
    riskLevel: "High",
    performance: {
      monthly: "+38.7%",
      yearly: "+142.3%"
    }
  }
];

// Mock forum discussions
const forumDiscussions = [
  {
    id: '1',
    author: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      reputation: 4.8
    },
    title: "BTC Technical Analysis: Potential Breakout Setup",
    content: "Looking at the daily chart, we're seeing a bullish flag pattern forming with increasing volume. Key resistance at $48,500 could be tested soon.",
    timestamp: "2 hours ago",
    likes: 45,
    comments: 23,
    sentiment: "bullish"
  },
  {
    id: '2',
    author: {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      reputation: 4.5
    },
    title: "Bitcoin's Correlation with Tech Stocks",
    content: "Interesting correlation between BTC and NASDAQ lately. This could suggest a shift in market dynamics and institutional involvement.",
    timestamp: "5 hours ago",
    likes: 38,
    comments: 15,
    sentiment: "neutral"
  }
];

export function Trade() {
  const [amount, setAmount] = useState('1000');
  const [leverage, setLeverage] = useState('10');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [timeframe, setTimeframe] = useState('1M');
  const [activeTab, setActiveTab] = useState('news');
  const [selectedStock] = useState({
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    price: 48235.50
  });

  const getCandlestickData = () => {
    const days = timeframe === '1M' ? 30 : 
                timeframe === '3M' ? 90 : 
                timeframe === '6M' ? 180 : 
                timeframe === '1Y' ? 365 : 3650;

    // Historical data (60% of timeframe)
    const historicalData = Array.from({ length: Math.floor(days * 0.6) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const basePrice = selectedStock.price * (1 + Math.sin(i * 0.1) * 0.1);
      const volatility = basePrice * 0.02;
      
      return {
        time: date.toISOString().split('T')[0],
        open: basePrice - volatility * Math.random(),
        high: basePrice + volatility,
        low: basePrice - volatility,
        close: basePrice + volatility * Math.random(),
      };
    });

    // Get the last closing price to use as base for predictions
    const lastClose = historicalData[historicalData.length - 1].close;
    const trendFactor = 0.15; // Upward trend factor

    // AI Prediction (40% of timeframe) - Following trend with slight variations
    const predictiveData = Array.from({ length: Math.floor(days * 0.4) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Create an upward trend with some oscillation
      const basePrice = lastClose * (1 + (i / (days * 0.4)) * trendFactor + Math.sin(i * 0.1) * 0.05);
      const volatility = basePrice * 0.015;
      
      return {
        time: date.toISOString().split('T')[0],
        open: basePrice - volatility * Math.random(),
        high: basePrice + volatility,
        low: basePrice - volatility,
        close: basePrice + volatility * Math.random(),
      };
    });

    // Community Prediction (40% of timeframe) - Similar trend but with different variations
    const communityData = Array.from({ length: Math.floor(days * 0.4) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Follow similar trend but with different oscillation pattern
      const basePrice = lastClose * (1 + (i / (days * 0.4)) * trendFactor + Math.cos(i * 0.15) * 0.03);
      const volatility = basePrice * 0.02;
      
      return {
        time: date.toISOString().split('T')[0],
        open: basePrice - volatility * Math.random(),
        high: basePrice + volatility,
        low: basePrice - volatility,
        close: basePrice + volatility * Math.random(),
      };
    });

    return {
      historical: historicalData,
      predictive: predictiveData,
      community: communityData
    };
  };

  const chartData = getCandlestickData();

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* FAANG Stocks Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">FAANG Stocks</h3>
                <button className="text-sm text-gray-400 hover:text-white transition flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {faangStocks.map((stock) => (
                  <div 
                    key={stock.symbol}
                    className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{stock.symbol}</span>
                          <span className={`text-sm ${
                            stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${stock.price}</div>
                        <div className="text-sm text-gray-400 mt-1">Vol: {stock.volume}</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <div className="text-sm text-gray-400">
                        Market Cap: {stock.marketCap}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-4">
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
                  <p className="text-gray-400">{selectedStock.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select 
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="1M">1 Month</option>
                    <option value="3M">3 Months</option>
                    <option value="6M">6 Months</option>
                    <option value="1Y">1 Year</option>
                    <option value="10Y">10 Years</option>
                  </select>
                  <button
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Bot className="h-5 w-5" />
                    <span>AI Assistant</span>
                  </button>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${selectedStock.price.toLocaleString()}</p>
                    <p className="text-green-500">+2.5% (24h)</p>
                  </div>
                </div>
              </div>
              <div className="h-[600px]">
                <CandlestickChart 
                  data={chartData.historical}
                  predictiveData={chartData.predictive}
                  communityData={chartData.community}
                />
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                  <span className="text-gray-400">Actual</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">AI Prediction</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Community Prediction</span>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <div className="border-b border-gray-700">
                <div className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('news')}
                    className={`py-4 relative ${
                      activeTab === 'news'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Newspaper className="h-5 w-5" />
                      <span>AI Analysis</span>
                    </div>
                    {activeTab === 'news' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('traders')}
                    className={`py-4 relative ${
                      activeTab === 'traders'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Top Traders</span>
                    </div>
                    {activeTab === 'traders' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('forum')}
                    className={`py-4 relative ${
                      activeTab === 'forum'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Discussion</span>
                    </div>
                    {activeTab === 'forum' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* News Tab Content */}
                {activeTab === 'news' && (
                  <div className="space-y-6">
                    {stockNews.map((news) => (
                      <div key={news.id} className="bg-gray-700/30 rounded-xl overflow-hidden hover:bg-gray-700/50 transition">
                        <div className="flex">
                          <div className="w-48 h-48 flex-shrink-0">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold text-white mb-2">{news.title}</h4>
                                <p className="text-gray-300 mb-4 line-clamp-2">{news.content}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm ml-4 ${
                                news.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                news.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {news.sentiment}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-400">{news.source}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-400">{news.time}</span>
                              </div>
                              <div className={`flex items-center space-x-2 text-sm ${
                                news.impact === 'high' ? 'text-red-400' :
                                news.impact === 'medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                <AlertTriangle className="h-4 w-4" />
                                <span>{news.impact} impact</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Top Traders Tab Content */}
                {activeTab === 'traders' && (
                  <div className="grid grid-cols-2 gap-6">
                    {topTraders.map((trader) => (
                      <div key={trader.id} className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition">
                        <div className="flex items-start space-x-4">
                          <img
                            src={trader.avatar}
                            alt={trader.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">{trader.name}</h3>
                              <span className="text-green-500">{trader.performance.monthly}</span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{trader.description}</p>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400">Win Rate</div>
                                <div className="text-white font-medium">{trader.winRate}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Style</div>
                                <div className="text-white font-medium">{trader.tradingStyle}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Risk</div>
                                <div className="text-white font-medium">{trader.riskLevel}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="text-gray-400 text-sm mb-2">Expertise</div>
                              <div className="flex flex-wrap gap-2">
                                {trader.expertise.map((pair, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-sm bg-blue-500/20 text-blue-400 rounded"
                                  >
                                    {pair}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 transition">
                              Copy Trader
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Forum Tab Content */}
                {activeTab === 'forum' && (
                  <div className="space-y-6">
                    {/* New Post Input */}
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                          alt="Your avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Share your analysis..."
                            className="w-full bg-gray-600/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                          Post
                        </button>
                      </div>
                    </div>

                    {/* Forum Posts */}
                    {forumDiscussions.map((discussion) => (
                      <div key={discussion.id} className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition">
                        <div className="flex items-start space-x-4">
                          <img
                            src={discussion.author.avatar}
                            alt={discussion.author.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-white">{discussion.author.name}</span>
                                  <span className="text-yellow-500">★ {discussion.author.reputation}</span>
                                </div>
                                <div className="text-gray-400 text-sm">{discussion.timestamp}</div>
                              </div>
                              <span className={`px-2 py-1 rounded text-sm ${
                                discussion.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                                discussion.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {discussion.sentiment}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mt-2">{discussion.title}</h3>
                            <p className="text-gray-300 mt-2">{discussion.content}</p>
                            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-400">
                              <button className="flex items-center space-x-1 hover:text-white transition">
                                <Heart className="h-4 w-4" />
                                <span>{discussion.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-white transition">
                                <MessageSquare className="h-4 w-4" />
                                <span>{discussion.comments} comments</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-white transition">
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}