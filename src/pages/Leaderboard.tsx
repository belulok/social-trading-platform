import React from 'react';
import { 
  Trophy, 
  Medal, 
  Target, 
  TrendingUp, 
  Award,
  Star,
  Clock,
  Zap,
  Shield,
  Crown
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
  rank: number;
  points: number;
  winRate: number;
  profitLoss: number;
  streak: number;
  level: number;
  badges: string[];
  recentAchievements: {
    title: string;
    description: string;
    points: number;
    icon: keyof typeof badges;
  }[];
  performance: number[];
}

const badges = {
  accuracy: '🎯',
  streak: '🔥',
  profit: '💰',
  volume: '📊',
  risk: '🛡️',
  speed: '⚡',
  analysis: '📈',
  social: '👥'
};

export function Leaderboard() {
  const traders: Trader[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rank: 1,
      points: 15420,
      winRate: 78,
      profitLoss: 234.5,
      streak: 12,
      level: 42,
      badges: ['accuracy', 'streak', 'profit', 'analysis'],
      recentAchievements: [
        {
          title: 'Perfect Week',
          description: 'Maintain 100% win rate for a week',
          points: 500,
          icon: 'accuracy'
        },
        {
          title: 'Hot Streak',
          description: '10 profitable trades in a row',
          points: 300,
          icon: 'streak'
        }
      ],
      performance: [45, 52, 49, 62, 58, 65]
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rank: 2,
      points: 14850,
      winRate: 82,
      profitLoss: 189.2,
      streak: 8,
      level: 38,
      badges: ['profit', 'volume', 'risk', 'social'],
      recentAchievements: [
        {
          title: 'Risk Master',
          description: 'Maintain positive returns with low volatility',
          points: 400,
          icon: 'risk'
        }
      ],
      performance: [42, 48, 55, 51, 58, 62]
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rank: 3,
      points: 13920,
      winRate: 75,
      profitLoss: 156.8,
      streak: 5,
      level: 35,
      badges: ['speed', 'analysis', 'volume'],
      recentAchievements: [
        {
          title: 'Speed Demon',
          description: 'Execute 100 trades in a day with positive returns',
          points: 450,
          icon: 'speed'
        }
      ],
      performance: [38, 45, 42, 48, 52, 55]
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rank: 4,
      points: 12780,
      winRate: 71,
      profitLoss: 142.3,
      streak: 3,
      level: 32,
      badges: ['social', 'analysis', 'accuracy'],
      recentAchievements: [
        {
          title: 'Community Leader',
          description: 'Help 50 traders improve their strategies',
          points: 350,
          icon: 'social'
        }
      ],
      performance: [35, 42, 38, 45, 48, 52]
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rank: 5,
      points: 11950,
      winRate: 68,
      profitLoss: 128.5,
      streak: 4,
      level: 30,
      badges: ['risk', 'profit', 'volume'],
      recentAchievements: [
        {
          title: 'Profit Hunter',
          description: 'Achieve 100% return on investment',
          points: 400,
          icon: 'profit'
        }
      ],
      performance: [32, 38, 35, 42, 45, 48]
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

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-gray-400">Compete with the best traders and earn rewards</p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-gray-800 text-white rounded-lg px-4 py-2">
              <option>Global</option>
              <option>Regional</option>
              <option>Friends</option>
            </select>
            <select className="bg-gray-800 text-white rounded-lg px-4 py-2">
              <option>All Time</option>
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Top 3 Traders */}
          <div className="col-span-3 grid grid-cols-3 gap-6 mb-6">
            {/* Second Place */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center transform translate-y-4">
              <div className="relative inline-block">
                <img
                  src={traders[1].avatar}
                  alt={traders[1].name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-silver-500"
                />
                <Medal className="absolute bottom-0 right-0 h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white mt-4">{traders[1].name}</h3>
              <div className="text-gray-400">2nd Place</div>
              <div className="text-2xl font-bold text-gray-300 mt-2">{traders[1].points.toLocaleString()} pts</div>
            </div>

            {/* First Place */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center transform -translate-y-4">
              <div className="relative inline-block">
                <img
                  src={traders[0].avatar}
                  alt={traders[0].name}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-yellow-500"
                />
                <Crown className="absolute bottom-0 right-0 h-10 w-10 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mt-4">{traders[0].name}</h3>
              <div className="text-gray-400">Champion</div>
              <div className="text-3xl font-bold text-yellow-500 mt-2">{traders[0].points.toLocaleString()} pts</div>
            </div>

            {/* Third Place */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center transform translate-y-4">
              <div className="relative inline-block">
                <img
                  src={traders[2].avatar}
                  alt={traders[2].name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-bronze-500"
                />
                <Medal className="absolute bottom-0 right-0 h-8 w-8 text-orange-300" />
              </div>
              <h3 className="text-xl font-bold text-white mt-4">{traders[2].name}</h3>
              <div className="text-gray-400">3rd Place</div>
              <div className="text-2xl font-bold text-orange-300 mt-2">{traders[2].points.toLocaleString()} pts</div>
            </div>
          </div>

          {/* Rankings Table */}
          <div className="col-span-2 bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Global Rankings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-4">Rank</th>
                    <th className="pb-4">Trader</th>
                    <th className="pb-4">Level</th>
                    <th className="pb-4">Win Rate</th>
                    <th className="pb-4">P/L</th>
                    <th className="pb-4">Points</th>
                    <th className="pb-4">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {traders.map((trader) => (
                    <tr key={trader.id} className="border-b border-gray-700/50">
                      <td className="py-4">
                        <div className="flex items-center">
                          {trader.rank === 1 && <Crown className="h-5 w-5 text-yellow-500 mr-2" />}
                          <span className="text-white font-medium">#{trader.rank}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            src={trader.avatar}
                            alt={trader.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <span className="text-white">{trader.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-white">{trader.level}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-green-500">{trader.winRate}%</span>
                      </td>
                      <td className="py-4">
                        <span className="text-green-500">+{trader.profitLoss}%</span>
                      </td>
                      <td className="py-4">
                        <span className="text-white font-medium">{trader.points.toLocaleString()}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-1">
                          {trader.badges.map((badge, index) => (
                            <span key={index} title={badge}>
                              {badges[badge as keyof typeof badges]}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Achievements & Stats */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
              <div className="space-y-4">
                {traders[0].recentAchievements.map((achievement, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {badges[achievement.icon]}
                        </span>
                        <div>
                          <h4 className="text-white font-medium">{achievement.title}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-yellow-500 font-medium">+{achievement.points}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Top Trader Performance</h2>
              <div className="h-[200px]">
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      data: traders[0].performance,
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
          </div>
        </div>
      </div>
    </div>
  );
}