import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, TrendingUp, ChevronRight, Award, Users } from 'lucide-react';
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
import { useAuth } from '../context/AuthContext';
import { MarketVisualization } from '../components/MarketVisualization';
import { SpiderChart } from '../components/SpiderChart';

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

export function Dashboard() {
  const { user } = useAuth();

  // Mock trading data
  const tradingStats = {
    currentBalance: 146000,
    initialBalance: 100000,
    dailyLossLimit: 583.03,
    maxLossRecorded: 77653.03,
    tradingDays: {
      minimum: 5,
      current: 7,
    },
    detailStatus: {
      trades: 124,
      lots: 55,
      winRate: '64%',
      loseRate: '36%',
      long: '36%',
      short: '64%',
      mostTradedPair: 'USD/JPY',
      currentRank: '2nd',
      profitFactor: 1.85,
      avgWinSize: '$856',
      avgLossSize: '$462',
      bestTrade: '$2,345',
    }
  };

  // Mock chart data
  const chartData = {
    labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
    datasets: [
      {
        label: 'Equity',
        data: [100000, 105000, 102000, 108000, 115000, 112000, 146000],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Balance',
        data: [100000, 102000, 101000, 106000, 110000, 108000, 142000],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

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
          callback: (value: number) => '$' + value.toLocaleString(),
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };

  // Mock recommended traders
  const recommendedTraders = [
    {
      id: '1',
      name: "Jacynth Tham",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      winRate: "78%",
      monthlyReturn: "+45.2%",
      followers: 1234,
      profitFactor: 2.1,
      description: "Specializes in trend following strategies with excellent risk management",
    },
    {
      id: '2',
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      winRate: "72%",
      monthlyReturn: "+38.7%",
      followers: 892,
      profitFactor: 1.9,
      description: "Expert in swing trading major currency pairs",
    },
    {
      id: '3',
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      winRate: "75%",
      monthlyReturn: "+41.3%",
      followers: 1567,
      profitFactor: 2.3,
      description: "Algorithmic trader focusing on market inefficiencies",
    },
    {
      id: '4',
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      winRate: "69%",
      monthlyReturn: "+35.8%",
      followers: 743,
      profitFactor: 1.8,
      description: "Scalping specialist with consistent returns",
    },
    {
      id: '5',
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      winRate: "71%",
      monthlyReturn: "+37.5%",
      followers: 921,
      profitFactor: 2.0,
      description: "Specializes in breakout trading strategies",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="relative pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Profile and Trading Profile - 2 Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* User Profile */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full bg-gray-700"
                />
                <div>
                  <h2 className="text-xl font-semibold text-white">Hello {user?.name}</h2>
                  <p className="text-gray-400">Currently at Rank {tradingStats.detailStatus.currentRank}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Balance:</span>
                  <span className="text-white">${tradingStats.currentBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Initial Balance:</span>
                  <span className="text-white">${tradingStats.initialBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Return:</span>
                  <span className="text-green-500">+46%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Trading Days:</span>
                  <span className="text-white">{tradingStats.tradingDays.current} Days</span>
                </div>
              </div>
            </div>

            {/* Trading Profile */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Trading Profile</h3>
              {user?.profile?.tradingProfile && (
                <SpiderChart data={user.profile.tradingProfile} />
              )}
            </div>
          </div>

          {/* Trading Statistics - Moved Down */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Trading Statistics</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-gray-400 mb-1">Profit Factor</div>
                <div className="text-xl font-semibold text-white">{tradingStats.detailStatus.profitFactor}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Win Rate</div>
                <div className="text-xl font-semibold text-white">{tradingStats.detailStatus.winRate}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Avg Win</div>
                <div className="text-xl font-semibold text-green-500">{tradingStats.detailStatus.avgWinSize}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Avg Loss</div>
                <div className="text-xl font-semibold text-red-500">{tradingStats.detailStatus.avgLossSize}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Best Trade</div>
                <div className="text-xl font-semibold text-green-500">{tradingStats.detailStatus.bestTrade}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Risk Ratio</div>
                <div className="text-xl font-semibold text-white">1:2.5</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Total Trades</div>
                <div className="text-xl font-semibold text-white">{tradingStats.detailStatus.trades}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Most Traded</div>
                <div className="text-xl font-semibold text-white">{tradingStats.detailStatus.mostTradedPair}</div>
              </div>
            </div>
          </div>

          {/* Trading Growth Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Trading Growth Curve</h3>
              <select className="bg-gray-700 text-white rounded-lg px-3 py-1 text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* AI Recommended Copy Traders */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Copy className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">AI Recommended Copy Traders</h3>
              </div>
              <button className="text-sm text-gray-400 hover:text-white transition flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {recommendedTraders.map((trader) => (
                <div 
                  key={trader.name} 
                  className="flex-none w-[300px] bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition flex flex-col"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={trader.avatar}
                      alt={trader.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white">{trader.name}</h4>
                        <Award className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        {trader.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                  <div className="h-[2px] bg-gray-700 my-4"></div>
                  <p className="text-sm text-gray-300 mb-4 flex-grow">{trader.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <div className="text-gray-400">Win Rate</div>
                      <div className="text-white font-medium">{trader.winRate}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Monthly Return</div>
                      <div className="text-green-500 font-medium">{trader.monthlyReturn}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Profit Factor</div>
                      <div className="text-white font-medium">{trader.profitFactor}</div>
                    </div>
                  </div>
                  <Link 
                    to={`/copy-trader/${trader.id}`}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 transition text-center"
                  >
                    Copy Trader
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}