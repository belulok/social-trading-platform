import React, { useState, useEffect } from 'react';
import { CandlestickChart } from '../components/CandlestickChart';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

interface Trade {
  type: 'long' | 'short';
  entry: number;
  exit: number | null;
  size: number;
  pnl: number;
  timestamp: Date;
}

export function Simulation() {
  const [balance, setBalance] = useState(10000);
  const [position, setPosition] = useState<Trade | null>(null);
  const [orderSize, setOrderSize] = useState('1000');
  const [currentPrice, setCurrentPrice] = useState(48235.50);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 100;
        return Number((prev + change).toFixed(2));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

  const generateChartData = () => {
    const periods = 100;
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start at beginning of current day
    
    const data = [];
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const basePrice = currentPrice * (1 + Math.sin(i * 0.1) * 0.1);
      const volatility = basePrice * 0.02;
      
      data.push({
        time: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
        open: Number((basePrice - volatility * Math.random()).toFixed(2)),
        high: Number((basePrice + volatility).toFixed(2)),
        low: Number((basePrice - volatility).toFixed(2)),
        close: Number((basePrice + volatility * Math.random()).toFixed(2))
      });
    }

    return data;
  };

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
              <CandlestickChart data={generateChartData()} />
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
    </div>
  );
}