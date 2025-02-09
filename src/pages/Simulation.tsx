import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CandlestickChart } from '../components/CandlestickChart';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertTriangle,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';

interface Trade {
  type: 'long' | 'short';
  entry: number;
  exit: number | null;
  size: number;
  pnl: number;
  timestamp: Date;
}

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function Simulation() {
  const [balance, setBalance] = useState(10000);
  const [position, setPosition] = useState<Trade | null>(null);
  const [orderSize, setOrderSize] = useState('1000');
  const [currentPrice, setCurrentPrice] = useState(48235.50);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [priceUpdateInterval, setPriceUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const chartDataRef = useRef<ChartData[]>([]);

  // Generate initial chart data
  useEffect(() => {
    chartDataRef.current = generateChartData();
  }, []);

  const updatePrice = useCallback(() => {
    setCurrentPrice(prev => {
      const baseVolatility = 100;
      const tradeVolatility = position ? 300 : baseVolatility;
      const bias = position?.type === 'long' ? 0.6 : position?.type === 'short' ? 0.4 : 0.5;
      
      const random = Math.random();
      const change = (random > bias ? 1 : -1) * tradeVolatility * random;
      const newPrice = Number((prev + change).toFixed(2));

      // Update the latest candle
      if (chartDataRef.current.length > 0) {
        const lastCandle = chartDataRef.current[chartDataRef.current.length - 1];
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high!, newPrice);
        lastCandle.low = Math.min(lastCandle.low!, newPrice);
      }

      return newPrice;
    });
  }, [position]);

  // Start fast price updates when position is opened
  useEffect(() => {
    if (priceUpdateInterval) {
      clearInterval(priceUpdateInterval);
    }

    const interval = setInterval(updatePrice, position ? 1000 : 2000);
    setPriceUpdateInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [position, updatePrice]);

  const generateChartData = () => {
    const periods = 100;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const data = [];
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const basePrice = currentPrice * (1 + Math.sin(i * 0.1) * 0.1);
      const volatility = basePrice * 0.02;
      
      data.push({
        time: date.toISOString().split('T')[0],
        open: Number((basePrice - volatility * Math.random()).toFixed(2)),
        high: Number((basePrice + volatility).toFixed(2)),
        low: Number((basePrice - volatility).toFixed(2)),
        close: Number((basePrice + volatility * Math.random()).toFixed(2))
      });
    }

    return data;
  };

  // Add new candle every minute
  useEffect(() => {
    const addNewCandle = () => {
      const now = new Date();
      const newCandle = {
        time: now.toISOString().split('T')[0],
        open: currentPrice,
        high: currentPrice,
        low: currentPrice,
        close: currentPrice
      };

      chartDataRef.current = [...chartDataRef.current.slice(-99), newCandle];
    };

    const interval = setInterval(addNewCandle, 60000); 
    return () => clearInterval(interval);
  }, [currentPrice]);

  const showError = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleTrade = (type: 'long' | 'short') => {
    const size = Number(orderSize);
    
    // Validation
    if (isNaN(size) || size <= 0) {
      showError('Please enter a valid position size');
      return;
    }
    
    if (size > balance) {
      showError('Insufficient balance');
      return;
    }

    if (size > balance * 0.1) {
      showError('Position size too large (max 10% of balance)');
      return;
    }

    // Close existing position if any
    if (position) {
      const pnl = position.type === 'long' 
        ? (currentPrice - position.entry) * position.size / position.entry
        : (position.entry - currentPrice) * position.size / position.entry;

      setTrades(prev => [...prev, {
        ...position,
        exit: currentPrice,
        pnl
      }]);

      setBalance(prev => prev + pnl);
      setPosition(null);
    } else {
      // Open new position
      setPosition({
        type,
        entry: currentPrice,
        exit: null,
        size,
        pnl: 0,
        timestamp: new Date()
      });
    }
  };

  // Mock forum discussions data
  const forumDiscussions = [
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        reputation: 4.8
      },
      timestamp: '2 hours ago',
      title: 'Bitcoin Technical Analysis: Bullish Divergence on 4H',
      content: 'Spotted a clear bullish RSI divergence on the 4-hour chart. Price making lower lows while RSI shows higher lows. Could be a good entry point for longs.',
      sentiment: 'bullish',
      likes: 124,
      comments: 45
    },
    {
      id: 2,
      author: {
        name: 'Michael Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        reputation: 4.5
      },
      timestamp: '4 hours ago',
      title: 'Market Structure Analysis: Key Resistance Levels',
      content: 'We’re approaching a major resistance zone at $48.5K. Multiple rejections in the past week suggest strong selling pressure. Be cautious with long positions.',
      sentiment: 'bearish',
      likes: 89,
      comments: 32
    },
    {
      id: 3,
      author: {
        name: 'Alex Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        reputation: 4.2
      },
      timestamp: '6 hours ago',
      title: 'Neutral Stance: Waiting for Clear Direction',
      content: 'Market seems to be consolidating in a tight range. Volume declining suggests a big move incoming, but direction unclear. Better to wait for confirmation.',
      sentiment: 'neutral',
      likes: 67,
      comments: 28
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-24 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {alertMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Paper Trading Simulator</h1>
            <p className="text-gray-400">Practice trading in a risk-free environment</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${balance.toLocaleString()}</div>
            <div className="text-gray-400">Demo Balance</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chart */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">BTC/USD</h2>
                <p className="text-gray-400">Bitcoin / US Dollar</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">${currentPrice.toLocaleString()}</p>
                <p className="text-green-500">Live Price</p>
              </div>
            </div>
            <div className="h-[600px]">
              <CandlestickChart getData={async () => {
                return {
                  historical: chartDataRef.current,
                  aiPrediction: chartDataRef.current.map(item => ({ ...item, value: item.close })),
                  trader1: chartDataRef.current.map(item => ({ ...item, value: item.close * (1 + Math.random() * 0.1) })),
                  trader2: chartDataRef.current.map(item => ({ ...item, value: item.close * (1 - Math.random() * 0.1) })),
                  trader3: chartDataRef.current.map(item => ({ ...item, value: item.close * (1 + (Math.random() - 0.5) * 0.1) }))
                };
              }} />
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Order Form */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Place Order</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Position Size (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="text"
                      value={orderSize}
                      onChange={(e) => setOrderSize(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4"
                      placeholder="Enter amount"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Max: ${(balance * 0.1).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTrade('long')}
                    className={`flex items-center justify-center py-3 rounded-lg transition ${
                      position?.type === 'long'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {position?.type === 'long' ? 'Close Long' : 'Buy/Long'}
                  </button>
                  <button
                    onClick={() => handleTrade('short')}
                    className={`flex items-center justify-center py-3 rounded-lg transition ${
                      position?.type === 'short'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                  >
                    <TrendingDown className="h-5 w-5 mr-2" />
                    {position?.type === 'short' ? 'Close Short' : 'Sell/Short'}
                  </button>
                </div>
              </div>
            </div>

            {/* Position Info */}
            {position && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Current Position</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className={position.type === 'long' ? 'text-green-500' : 'text-red-500'}>
                      {position.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entry Price</span>
                    <span className="text-white">${position.entry.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size</span>
                    <span className="text-white">${position.size.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unrealized P&L</span>
                    <span className={`font-medium ${
                      currentPrice > position.entry ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${((currentPrice - position.entry) * position.size / position.entry).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Trade History */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
              <div className="space-y-3">
                {trades.slice(-5).reverse().map((trade, i) => (
                  <div key={i} className="p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className={trade.type === 'long' ? 'text-green-500' : 'text-red-500'}>
                        {trade.type.toUpperCase()}
                      </span>
                      <span className={trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        ${trade.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>${trade.entry.toFixed(2)} → ${trade.exit?.toFixed(2)}</span>
                      <span>{trade.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
                {trades.length === 0 && (
                  <p className="text-gray-400 text-center">No trades yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Discussions */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-6">Community Discussions</h2>
        <div className="space-y-4 w-full max-w-4xl">
          {forumDiscussions.map((discussion) => (
            <div key={discussion.id} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700/50 transition">
              <div className="flex items-start space-x-4">
                <img
                  src={discussion.author.avatar}
                  alt={discussion.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white truncate">{discussion.author.name}</span>
                        <span className="text-yellow-500 flex-shrink-0">★ {discussion.author.reputation}</span>
                      </div>
                      <div className="text-gray-400 text-xs">{discussion.timestamp}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${
                      discussion.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                      discussion.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {discussion.sentiment}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mt-1 truncate">{discussion.title}</h3>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{discussion.content}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-white transition">
                      <Heart className="h-3 w-3" />
                      <span>{discussion.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-white transition">
                      <MessageSquare className="h-3 w-3" />
                      <span>{discussion.comments} comments</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-white transition">
                      <Share2 className="h-3 w-3" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}