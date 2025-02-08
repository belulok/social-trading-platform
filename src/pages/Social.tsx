import React from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  TrendingUp, 
  Award,
  Users,
  ChevronRight
} from 'lucide-react';

export function Social() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Trader avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">Alex Thompson</h3>
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-400 text-sm">@alexthompson</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    Just closed a successful long position on BTC/USD. The key was watching the 200-day moving average and RSI divergence. Here's my analysis 👇
                  </p>
                  <div className="mt-4 bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">BTC/USD Long</span>
                      <span className="text-green-500">+12.5%</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Entry: $43,250 | Exit: $48,656
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mt-4 text-gray-400">
                    <button className="flex items-center space-x-2 hover:text-white transition">
                      <Heart className="h-5 w-5" />
                      <span>245</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-white transition">
                      <MessageSquare className="h-5 w-5" />
                      <span>23</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-white transition">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Post */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Trader avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">Sarah Chen</h3>
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-400 text-sm">@sarahchen</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    Market analysis: ETH showing strong support at $2,800. Looking for a potential breakout above $3,000 with increasing volume. What are your thoughts? 📈
                  </p>
                  <div className="flex items-center space-x-6 mt-4 text-gray-400">
                    <button className="flex items-center space-x-2 hover:text-white transition">
                      <Heart className="h-5 w-5" />
                      <span>182</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-white transition">
                      <MessageSquare className="h-5 w-5" />
                      <span>45</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-white transition">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Traders */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Top Traders</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Top trader"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">Alex Thompson</p>
                      <p className="text-green-500">+234.5% (30d)</p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-400 transition">
                    Follow
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Top trader"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">Sarah Chen</p>
                      <p className="text-green-500">+189.2% (30d)</p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-400 transition">
                    Follow
                  </button>
                </div>
              </div>
              <button className="w-full mt-4 text-gray-400 hover:text-white transition flex items-center justify-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Trading Stats */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Win Rate</span>
                  <span className="text-green-500">68%</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Total Trades</span>
                  <span>142</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Followers</span>
                  <span>1,234</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Trending</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400 hover:text-white transition cursor-pointer">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  #Bitcoin
                </div>
                <div className="flex items-center text-gray-400 hover:text-white transition cursor-pointer">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  #TradingStrategy
                </div>
                <div className="flex items-center text-gray-400 hover:text-white transition cursor-pointer">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  #CryptoNews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}