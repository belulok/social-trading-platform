import React, { useState, useEffect } from 'react';
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
import StockNews from '../components/StockNews';
import { Link, useNavigate } from 'react-router-dom';

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
      avatar: "https://images.unsplash.com/photo-1534528741775-b48cc8e92a4d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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

interface ChartData {
  time: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  value?: number;
}

export function Trade() {
  const [amount, setAmount] = useState('1000');
  const [leverage, setLeverage] = useState('10');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [timeframe, setTimeframe] = useState('1M');
  const [activeTab, setActiveTab] = useState('news');
  const [selectedStock, setSelectedStock] = useState({
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 0,
    change: 0,
    changePercent: 0
  });

  const [chartData, setChartData] = useState<{
    historical: ChartData[];
    aiPrediction: ChartData[];
    trader1: ChartData[];
    trader2: ChartData[];
    trader3: ChartData[];
  } | null>(null);

  const navigate = useNavigate();

  const handleStockSelect = async (stock: typeof faangStocks[0]) => {
    try {
      // Fetch latest price for the selected stock
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=cujqorhr01qgs4826fb0cujqorhr01qgs4826fbg`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();
      
      // Update the selected stock in the FAANG stocks array
      const updatedFaangStocks = faangStocks.map(s => {
        if (s.symbol === stock.symbol) {
          return {
            ...s,
            price: data.c,
            change: data.d || stock.change,
            changePercent: data.dp || (stock.change / stock.price) * 100
          };
        }
        return s;
      });

      // Update the global faangStocks array
      Object.assign(faangStocks, updatedFaangStocks);

      // Update selected stock state
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.name,
        price: data.c,
        change: data.d || stock.change,
        changePercent: data.dp || (stock.change / stock.price) * 100
      });

      // Fetch new data for the selected stock
      getCandlestickData(stock.symbol);
      
    } catch (error) {
      console.error('Error updating stock data:', error);
      // Fall back to using the existing stock data
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: (stock.change / stock.price) * 100
      });
      getCandlestickData(stock.symbol);
    }
  };

  useEffect(() => {
    // Fetch data once when component mounts
    getCandlestickData().then(data => {
      setChartData(data);
      // Update selected stock price with the latest data
      fetch('https://finnhub.io/api/v1/quote?symbol=AAPL&token=cujqorhr01qgs4826fb0cujqorhr01qgs4826fbg')
        .then(response => response.json())
        .then(quoteData => {
          setSelectedStock({
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: quoteData.c,
            change: quoteData.d,
            changePercent: quoteData.dp
          });
        });
    });
  }, []);

  const getCandlestickData = async (symbol: string = 'AAPL') => {
    try {
      // 1. Get current price from API
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cujqorhr01qgs4826fb0cujqorhr01qgs4826fbg`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();
      const currentPrice = data.c;

      // 2. Generate past 90 days of historical data
      const historicalData = [];
      const currentDate = new Date();
      let pastPrice = currentPrice - (currentPrice * 0.20); // Start 20% below current price

      // Generate 90 days of past data with more realistic movements
      for (let i = 90; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        
        // Generate realistic daily price movements trending towards current price
        const progressToPresent = (90 - i) / 90; // 0 to 1 as we get closer to present
        const targetPrice = currentPrice;
        const priceGap = targetPrice - pastPrice;
        // More varied price movements
        const trendStrength = Math.sin(i * 0.1) * 0.3 + 0.7; // Varies between 0.4 and 1.0
        const dailyChange = (priceGap * progressToPresent * 0.05 * trendStrength) + 
                          ((Math.random() - 0.5) * Math.max(2, currentPrice * 0.01)); // Scaled to price
        
        const dayClose = i === 0 ? currentPrice : pastPrice + dailyChange;
        
        // Larger intraday price movements for more visible candlesticks
        const volatility = Math.max(2, currentPrice * 0.015 * (1 + Math.sin(i * 0.05))); // Varying volatility
        const dayOpen = dayClose + ((Math.random() - 0.5) * volatility);
        const highLowRange = Math.max(1, volatility * 0.6); // High-low range based on volatility
        const dayHigh = Math.max(dayOpen, dayClose) + (Math.random() * highLowRange);
        const dayLow = Math.min(dayOpen, dayClose) - (Math.random() * highLowRange);

        historicalData.push({
          time: date.toISOString().split('T')[0],
          open: Number(dayOpen.toFixed(2)),
          high: Number(dayHigh.toFixed(2)),
          low: Number(dayLow.toFixed(2)),
          close: Number(dayClose.toFixed(2))
        });

        // Add some market cycles and patterns
        if (i % 20 === 0) { // Every 20 days, add some trend changes
          const trendChange = (Math.random() - 0.5) * Math.max(5, currentPrice * 0.02);
          pastPrice += trendChange;
        } else {
          pastPrice = dayClose;
        }
      }

      // 3. Generate future predictions (next 30 days)
      const futureStartDate = new Date(currentDate);
      futureStartDate.setDate(futureStartDate.getDate() + 1);

      // All predictions start exactly from current price
      const baselinePrice = currentPrice;

      // AI Prediction (purple line) - more conservative
      const aiPrediction = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(futureStartDate);
        date.setDate(date.getDate() + i);
        let predictedPrice;
        if (i === 0) {
          predictedPrice = baselinePrice;
        } else {
          const change = (Math.sin(i * 0.2) * 10) + (i * 0.5); // Dollar amount changes
          predictedPrice = baselinePrice + change;
        }
        return {
          time: date.toISOString().split('T')[0],
          value: Number(predictedPrice.toFixed(2))
        };
      });

      // Trader 1 - Aggressive growth strategy
      const trader1Data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(futureStartDate);
        date.setDate(date.getDate() + i);
        let predictedPrice;
        if (i === 0) {
          predictedPrice = baselinePrice;
        } else {
          const change = (Math.sin((i + 2) * 0.2) * 15) + (i * 0.8); // Larger dollar changes
          predictedPrice = baselinePrice + change;
        }
        return {
          time: date.toISOString().split('T')[0],
          value: Number(predictedPrice.toFixed(2))
        };
      });

      // Trader 2 - Conservative strategy
      const trader2Data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(futureStartDate);
        date.setDate(date.getDate() + i);
        let predictedPrice;
        if (i === 0) {
          predictedPrice = baselinePrice;
        } else {
          const change = (Math.cos(i * 0.15) * 8) + (i * 0.3); // Smaller dollar changes
          predictedPrice = baselinePrice + change;
        }
        return {
          time: date.toISOString().split('T')[0],
          value: Number(predictedPrice.toFixed(2))
        };
      });

      // Trader 3 - Volatile strategy
      const trader3Data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(futureStartDate);
        date.setDate(date.getDate() + i);
        let predictedPrice;
        if (i === 0) {
          predictedPrice = baselinePrice;
        } else {
          const change = (Math.sin((i - 2) * 0.25) * 12) + (i * 0.6); // Medium dollar changes
          predictedPrice = baselinePrice + change;
        }
        return {
          time: date.toISOString().split('T')[0],
          value: Number(predictedPrice.toFixed(2))
        };
      });

      const chartData = {
        historical: historicalData,
        aiPrediction,
        trader1: trader1Data,
        trader2: trader2Data,
        trader3: trader3Data
      };

      setChartData(chartData);
      return chartData;

    } catch (error) {
      console.error('Error fetching stock data:', error);
      return {
        historical: [],
        aiPrediction: [],
        trader1: [],
        trader2: [],
        trader3: []
      };
    }
  };

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
                    onClick={() => handleStockSelect(stock)}
                    className={`cursor-pointer p-4 rounded-lg transition-all duration-200 ${
                      selectedStock.symbol === stock.symbol
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{stock.symbol}</h3>
                        <p className="text-sm text-gray-300">{stock.name}</p>
                      </div>
                      <div className={`flex items-center ${
                        stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stock.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-semibold text-white">${stock.price}</span>
                      <span className={`text-sm ${
                        stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
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
                  <h2 className="text-2xl font-bold text-white">{selectedStock.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-white">
                      ${selectedStock.price?.toFixed(2)}
                    </span>
                    <span className={`text-sm ${selectedStock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change?.toFixed(2)} ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent?.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                <Link to="/simulation">
                  <button
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Bot className="h-5 w-5" />
                    <span>Simulate</span>
                  </button>
                </Link>
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
                    className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Bot className="h-5 w-5" />
                    <span>AI Assistant</span>
                  </button>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${selectedStock.price.toLocaleString()}</p>
                    <p className={`text-${selectedStock.changePercent >= 0 ? 'green-500' : 'red-500'}`}>{selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}% (24h)</p>
                  </div>
                </div>
              </div>
              <div className="h-[600px]">
                {chartData && (
                  <CandlestickChart 
                    getData={() => Promise.resolve(chartData)}
                  />
                )}
              </div>
              {/* Legend */}
              <div className="flex gap-4 mt-4 justify-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Current Price</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">AI Prediction</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Copy Trader 1</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Copy Trader 2</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Copy Trader 3</span>
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
                    
                    <div className="bg-gray-700/30 rounded-xl p-6">
                      <h2 className="text-lg font-semibold text-white mb-4">Latest Market News</h2>
                      <StockNews stockName={selectedStock.name} />
                    </div>
                  </div>
                )}

                {/* Top Traders Tab Content */}
                {activeTab === 'traders' && (
                  <div className="grid grid-cols-2 gap-6">
                    {topTraders.map((trader) => (
                      <div key={trader.id} className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/50 transition cursor-pointer"
                           onClick={() => navigate(`/copy-trader/${trader.id}`)}>
                        <div className="flex items-start space-x-4">
                          <img
                            src={trader.avatar}
                            alt={trader.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white hover:text-red-400 transition">{trader.name}</h3>
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
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={() => navigate(`/copy-trader/${discussion.author.id}`)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 
                                    className="font-semibold text-white hover:text-red-400 transition cursor-pointer"
                                    onClick={() => navigate(`/copy-trader/${discussion.author.id}`)}
                                  >
                                    {discussion.author.name}
                                  </h3>
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