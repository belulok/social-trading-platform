import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  AlertTriangle, 
  Award,
  Brain,
  BarChart2,
  ChevronDown,
  Info,
  X,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Trader {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  totalTrades: number;
  profitLoss: number;
  experience: 'Beginner' | 'Intermediate' | 'Expert';
  tradingType: 'Scalping' | 'Swing Trading' | 'Long-Term' | 'Arbitrage';
  market: 'Stocks' | 'Crypto' | 'Forex';
  riskLevel: 'Low' | 'Medium' | 'High';
  monthlyProfit: number[];
  lastActive: string;
  aiScore: number;
  strengths: string[];
  weaknesses: string[];
}

export function AdminDashboard() {
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    winRate: 0,
    experience: 'all',
    tradingType: 'all',
    market: 'all',
    riskLevel: 'all'
  });

  const traders: Trader[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 78,
      totalTrades: 456,
      profitLoss: 234.5,
      experience: 'Expert',
      tradingType: 'Scalping',
      market: 'Crypto',
      riskLevel: 'High',
      monthlyProfit: [12, 15, 8, 23, 18, 25],
      lastActive: '2 minutes ago',
      aiScore: 92,
      strengths: ['Technical Analysis', 'Risk Management', 'Market Timing'],
      weaknesses: ['Emotional Trading', 'Position Sizing']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 82,
      totalTrades: 892,
      profitLoss: 189.2,
      experience: 'Expert',
      tradingType: 'Long-Term',
      market: 'Stocks',
      riskLevel: 'Low',
      monthlyProfit: [15, 18, 20, 17, 22, 25],
      lastActive: '5 minutes ago',
      aiScore: 95,
      strengths: ['Fundamental Analysis', 'Portfolio Management', 'Trend Following'],
      weaknesses: ['Short-term Volatility', 'Quick Decision Making']
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 69,
      totalTrades: 743,
      profitLoss: 35.8,
      experience: 'Intermediate',
      tradingType: 'Swing Trading',
      market: 'Forex',
      riskLevel: 'Medium',
      monthlyProfit: [8, 12, -5, 15, 10, 18],
      lastActive: '15 minutes ago',
      aiScore: 78,
      strengths: ['Pattern Recognition', 'Currency Correlations'],
      weaknesses: ['Risk Management', 'Over-trading']
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 71,
      totalTrades: 921,
      profitLoss: 37.5,
      experience: 'Intermediate',
      tradingType: 'Arbitrage',
      market: 'Crypto',
      riskLevel: 'Medium',
      monthlyProfit: [10, 8, 12, 15, 13, 16],
      lastActive: '1 hour ago',
      aiScore: 82,
      strengths: ['Market Inefficiencies', 'Quick Execution'],
      weaknesses: ['Complex Strategies', 'High Transaction Costs']
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 65,
      totalTrades: 324,
      profitLoss: -12.3,
      experience: 'Beginner',
      tradingType: 'Scalping',
      market: 'Forex',
      riskLevel: 'High',
      monthlyProfit: [-5, -8, 2, 5, -3, 8],
      lastActive: '2 hours ago',
      aiScore: 45,
      strengths: ['Technical Tools', 'Learning Attitude'],
      weaknesses: ['Experience', 'Strategy Consistency', 'Risk Management']
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 88,
      totalTrades: 1234,
      profitLoss: 312.7,
      experience: 'Expert',
      tradingType: 'Long-Term',
      market: 'Stocks',
      riskLevel: 'Low',
      monthlyProfit: [25, 28, 22, 30, 27, 32],
      lastActive: '3 hours ago',
      aiScore: 98,
      strengths: ['Value Investing', 'Market Analysis', 'Risk Assessment'],
      weaknesses: ['Short-term Opportunities']
    },
    {
      id: '7',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 73,
      totalTrades: 567,
      profitLoss: 89.4,
      experience: 'Intermediate',
      tradingType: 'Swing Trading',
      market: 'Crypto',
      riskLevel: 'Medium',
      monthlyProfit: [12, 15, 10, 18, 16, 20],
      lastActive: '4 hours ago',
      aiScore: 85,
      strengths: ['Trend Analysis', 'Position Sizing'],
      weaknesses: ['Emotional Control', 'FOMO Trading']
    },
    {
      id: '8',
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 62,
      totalTrades: 245,
      profitLoss: -8.9,
      experience: 'Beginner',
      tradingType: 'Scalping',
      market: 'Forex',
      riskLevel: 'High',
      monthlyProfit: [-2, 5, -4, 8, -6, 4],
      lastActive: '5 hours ago',
      aiScore: 52,
      strengths: ['Quick Learning', 'Adaptability'],
      weaknesses: ['Strategy Development', 'Market Knowledge']
    },
    {
      id: '9',
      name: 'Robert Chen',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 85,
      totalTrades: 789,
      profitLoss: 156.8,
      experience: 'Expert',
      tradingType: 'Arbitrage',
      market: 'Crypto',
      riskLevel: 'Medium',
      monthlyProfit: [18, 22, 20, 25, 23, 28],
      lastActive: '6 hours ago',
      aiScore: 91,
      strengths: ['Algorithm Development', 'Market Analysis'],
      weaknesses: ['Manual Trading', 'Strategy Adaptation']
    },
    {
      id: '10',
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      winRate: 76,
      totalTrades: 678,
      profitLoss: 123.4,
      experience: 'Intermediate',
      tradingType: 'Swing Trading',
      market: 'Stocks',
      riskLevel: 'Low',
      monthlyProfit: [15, 18, 16, 20, 19, 22],
      lastActive: '1 day ago',
      aiScore: 88,
      strengths: ['Technical Analysis', 'Risk Management'],
      weaknesses: ['Market Timing', 'Position Holding']
    }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value: number) => value + '%',
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Beginner': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header & Analytics */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trader Management</h1>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 mb-1">Total Traders</div>
              <div className="text-2xl font-bold text-white">2,345</div>
              <div className="text-green-500 text-sm">+12% this month</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 mb-1">Average Win Rate</div>
              <div className="text-2xl font-bold text-white">68.5%</div>
              <div className="text-green-500 text-sm">+2.3% vs last month</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 mb-1">High Risk Traders</div>
              <div className="text-2xl font-bold text-red-500">234</div>
              <div className="text-red-500 text-sm">+5% this month</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 mb-1">New Traders</div>
              <div className="text-2xl font-bold text-white">128</div>
              <div className="text-green-500 text-sm">+8% vs last month</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search traders..."
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Minimum Win Rate</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.winRate}
                    onChange={(e) => setFilters({ ...filters, winRate: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-white text-sm">{filters.winRate}%</div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Experience Level</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Trading Type</label>
                  <select
                    value={filters.tradingType}
                    onChange={(e) => setFilters({ ...filters, tradingType: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    <option value="scalping">Scalping</option>
                    <option value="swing">Swing Trading</option>
                    <option value="long-term">Long-Term</option>
                    <option value="arbitrage">Arbitrage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Market Focus</label>
                  <select
                    value={filters.market}
                    onChange={(e) => setFilters({ ...filters, market: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All Markets</option>
                    <option value="stocks">Stocks</option>
                    <option value="crypto">Crypto</option>
                    <option value="forex">Forex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Risk Level</label>
                  <select
                    value={filters.riskLevel}
                    onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Trader Table */}
          <div className="col-span-3 bg-gray-800 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-4 text-gray-400">
                      <div className="flex items-center">
                        Trader
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="pb-4 text-gray-400">
                      <div className="flex items-center">
                        Win Rate
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="pb-4 text-gray-400">
                      <div className="flex items-center">
                        P/L
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="pb-4 text-gray-400">Type</th>
                    <th className="pb-4 text-gray-400">Risk</th>
                    <th className="pb-4 text-gray-400">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {traders.map((trader) => (
                    <tr 
                      key={trader.id}
                      className="border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30"
                      onClick={() => setSelectedTrader(trader)}
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            src={trader.avatar}
                            alt={trader.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="text-white font-medium">{trader.name}</div>
                            <div className="text-gray-400 text-sm">{trader.experience}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-green-500">{trader.winRate}%</span>
                      </td>
                      <td className="py-4">
                        <span className={trader.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {trader.profitLoss >= 0 ? '+' : ''}{trader.profitLoss}%
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">{trader.tradingType}</td>
                      <td className="py-4">
                        <span className={`${getRiskColor(trader.riskLevel)}`}>
                          {trader.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">{trader.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trader Profile Modal */}
        {selectedTrader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedTrader(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="grid grid-cols-3 gap-6">
                {/* Trader Info */}
                <div className="col-span-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={selectedTrader.avatar}
                      alt={selectedTrader.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedTrader.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getExperienceColor(selectedTrader.experience)} text-white`}>
                        {selectedTrader.experience}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-400 mb-1">Trading Style</div>
                      <div className="text-white">{selectedTrader.tradingType}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Market Focus</div>
                      <div className="text-white">{selectedTrader.market}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Risk Level</div>
                      <div className={getRiskColor(selectedTrader.riskLevel)}>
                        {selectedTrader.riskLevel}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Total Trades</div>
                      <div className="text-white">{selectedTrader.totalTrades}</div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="col-span-2">
                  <h4 className="text-lg font-semibold text-white mb-4">Monthly Performance</h4>
                  <div className="h-[200px]">
                    <Line
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                          data: selectedTrader.monthlyProfit,
                          borderColor: 'rgba(34, 197, 94, 1)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          fill: true,
                          tension: 0.4,
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="col-span-3 grid grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Brain className="h-5 w-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">AI Analysis</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-gray-400 mb-1">AI Score</div>
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedTrader.aiScore}/100
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-2">Strengths</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrader.strengths.map((strength, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-2">Areas for Improvement</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrader.weaknesses.map((weakness, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-sm"
                            >
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <h4 className="text-lg font-semibold text-white">Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <div className="text-blue-400 font-medium mb-1">Suggested Course</div>
                        <p className="text-gray-300 text-sm">
                          Advanced Risk Management Strategies
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <div className="text-purple-400 font-medium mb-1">Trading Tool</div>
                        <p className="text-gray-300 text-sm">
                          Position Size Calculator Pro
                        </p>
                      </div>
                      <div className="p-3 bg-red-500/20 rounded-lg">
                        <div className="text-red-400 font-medium mb-1">Risk Warning</div>
                        <p className="text-gray-300 text-sm">
                          High exposure in volatile markets
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}