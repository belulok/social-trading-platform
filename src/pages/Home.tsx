import React from 'react';
import { Users, BookOpen, Copy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketVisualization } from '../components/MarketVisualization';

export function Home() {
  return (
    <div className="relative min-h-screen">
      <MarketVisualization />
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Learn, Trade, Succeed <span className="text-red-500">Together</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join a community of traders, copy successful strategies, and learn from the best. Your journey to trading mastery starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition flex items-center"
            >
              Start Trading Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/social"
              className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              View Top Traders
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-red-500" />}
              title="Social Trading"
              description="Follow and interact with successful traders. Learn from their strategies and decisions."
            />
            <FeatureCard
              icon={<Copy className="h-8 w-8 text-red-500" />}
              title="Copy Trading"
              description="Automatically copy trades from top performers. Customize allocation and risk management."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-red-500" />}
              title="Learning Hub"
              description="Access educational resources, webinars, and trading insights from experienced traders."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="10K+" label="Active Traders" />
            <StatCard number="$50M+" label="Monthly Volume" />
            <StatCard number="95%" label="Success Rate" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-gray-900/30 p-6 rounded-xl backdrop-blur-sm">
      <div className="text-3xl font-bold text-red-500 mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}