import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Award, TrendingUp, AlertTriangle, History } from 'lucide-react';
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
  Filler,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function CopyTrader() {
  const { id } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock trader data
  const trader = {
    id: '1',
    name: "Jacynth Tham",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "Germany",
    joinedDate: "2023/11/22",
    followers: 1898,
    description: "Professional trader specializing in futures and forex markets. Focused on risk management and consistent returns.",
    stats: {
      totalReturn: "+150.86%",
      weeklyProfit: "+35.45%",
      winRate: "78%",
      profitFactor: 2.1,
      avgTradeLength: "4h 15m",
      totalTrades: 1245,
      successfulTrades: 971,
      averageWin: "$856",
      averageLoss: "$462",
      maxDrawdown: "15.3%",
      riskScore: 7.2,
    }
  };

  // ROI Chart data
  const roiChartData = {
    labels: ['Nov 22', 'Dec 22', 'Jan 23', 'Feb 23', 'Mar 23', 'Apr 23'],
    datasets: [{
      label: 'ROI %',
      data: [-20, -35, 0, 25, 40, 150.86],
      borderColor: 'rgba(37, 99, 235, 1)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  // Weekly Profit Chart data
  const weeklyProfitData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Profit/Loss',
      data: [2500, 3500, -1200, 4500, -800, 5200],
      backgroundColor: (context) => {
        const value = context.dataset.data[context.dataIndex];
        return value > 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
      },
    }]
  };

  // Chart options
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

  // Mock trade history
  const tradeHistory = [
    { id: 1, pair: 'SOLUSDT', type: 'Long', size: '20x', entry: '92.986', exit: '100', time: '01/14 18:07:43', roi: '+150.86%' },
    { id: 2, pair: 'HBARUSDT', type: 'Long', size: '5x', entry: '0.07837', exit: '0.08627', time: '01/11 14:37:29', roi: '+50.38%' },
    { id: 3, pair: 'GALAUSDT', type: 'Long', size: '25x', entry: '0.02582', exit: '0.0287', time: '01/11 14:34:10', roi: '+222.7%' },
    { id: 4, pair: 'GALAUSDT', type: 'Long', size: '25x', entry: '0.02582', exit: '0.02865', time: '01/11 14:22:43', roi: '+218.62%' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <img src={trader.avatar} alt={trader.name} className="w-20 h-20 rounded-full" />
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-white">{trader.name}</h1>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex items-center space-x-4 mt-2 text-gray-400">
                  <span>{trader.location}</span>
                  <span>•</span>
                  <span>Joined {trader.joinedDate}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {trader.followers.toLocaleString()} followers
                  </div>
                </div>
                <p className="mt-2 text-gray-300 max-w-2xl">{trader.description}</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition">
              Copy Trader
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Return', value: trader.stats.totalReturn, color: 'text-green-500' },
            { label: 'Win Rate', value: trader.stats.winRate, color: 'text-white' },
            { label: 'Profit Factor', value: trader.stats.profitFactor, color: 'text-white' },
            { label: 'Risk Score', value: trader.stats.riskScore + '/10', color: 'text-yellow-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
              <div className="text-gray-400 text-sm">{stat.label}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* ROI Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Return on Investment</h3>
            <div className="h-[300px]">
              <Line data={roiChartData} options={chartOptions} />
            </div>
          </div>

          {/* Weekly Profit */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Profit/Loss</h3>
            <div className="h-[300px]">
              <Line data={weeklyProfitData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-gray-400 mb-1">Max Drawdown</div>
              <div className="text-xl font-semibold text-red-500">{trader.stats.maxDrawdown}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Average Win</div>
              <div className="text-xl font-semibold text-green-500">{trader.stats.averageWin}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Average Loss</div>
              <div className="text-xl font-semibold text-red-500">{trader.stats.averageLoss}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Avg Trade Length</div>
              <div className="text-xl font-semibold text-white">{trader.stats.avgTradeLength}</div>
            </div>
          </div>
        </div>

        {/* Trade History */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
            </div>
            <button className="text-sm text-gray-400 hover:text-white transition">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-4">Pair</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Size</th>
                  <th className="pb-4">Entry Price</th>
                  <th className="pb-4">Exit Price</th>
                  <th className="pb-4">Time</th>
                  <th className="pb-4 text-right">ROI</th>
                </tr>
              </thead>
              <tbody>
                {tradeHistory.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-700/50">
                    <td className="py-4 text-white">{trade.pair}</td>
                    <td className="py-4 text-green-500">{trade.type}</td>
                    <td className="py-4 text-white">{trade.size}</td>
                    <td className="py-4 text-white">{trade.entry}</td>
                    <td className="py-4 text-white">{trade.exit}</td>
                    <td className="py-4 text-gray-400">{trade.time}</td>
                    <td className="py-4 text-green-500 text-right">{trade.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}