import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MarketVisualization } from '../components/MarketVisualization';
import { SpiderChart } from '../components/SpiderChart';
import { useAuth } from '../context/AuthContext';

interface ProfileData {
  riskComfort: number;
  lossTolerance: number;
  timeHorizon: number;
  researchEffort: number;
  leverageAttitude: number;
  tradingFrequency: number;
}

const questions = [
  {
    id: 'riskComfort',
    question: "If you had some extra money, would you prefer to keep it safe in a savings account or try something that could grow faster but also might lose value?",
    options: [
      { label: "Keep it safe in savings", value: 1 },
      { label: "Mix of safe and growth", value: 3 },
      { label: "Grow faster but might lose value", value: 5 },
    ],
  },
  {
    id: 'lossTolerance',
    question: "Imagine you put $100 into something, and a week later it's worth $90. What would you do?",
    options: [
      { label: "Sell immediately to prevent further losses", value: 1 },
      { label: "Wait and see for a while", value: 3 },
      { label: "Buy more while it's cheaper", value: 5 },
    ],
  },
  {
    id: 'timeHorizon',
    question: "If you decide to invest, how long do you plan to leave your money there before taking it out?",
    options: [
      { label: "Less than 6 months", value: 1 },
      { label: "6 months to 1 year", value: 3 },
      { label: "More than 1 year", value: 5 },
    ],
  },
  {
    id: 'researchEffort',
    question: "How much time are you willing to spend researching your trades?",
    options: [
      { label: "Minimal - quick decisions", value: 1 },
      { label: "Some research when needed", value: 3 },
      { label: "Extensive daily research", value: 5 },
    ],
  },
  {
    id: 'leverageAttitude',
    question: "What's your view on using leverage (borrowed money) for trading?",
    options: [
      { label: "Never use leverage", value: 1 },
      { label: "Use minimal leverage occasionally", value: 3 },
      { label: "Comfortable using leverage regularly", value: 5 },
    ],
  },
  {
    id: 'tradingFrequency',
    question: "How often do you plan to make trades?",
    options: [
      { label: "Few times per month", value: 1 },
      { label: "Few times per week", value: 3 },
      { label: "Multiple times per day", value: 5 },
    ],
  },
];

export function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [profile, setProfile] = useState<ProfileData>({
    riskComfort: 0,
    lossTolerance: 0,
    timeHorizon: 0,
    researchEffort: 0,
    leverageAttitude: 0,
    tradingFrequency: 0,
  });

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id as keyof ProfileData;
    setProfile(prev => ({
      ...prev,
      [questionId]: value
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        tradingProfile: profile
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <MarketVisualization />
      
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full space-y-8 bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white">Complete Your Profile</h2>
            <p className="mt-2 text-gray-400">Question {currentQuestion + 1} of {questions.length}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  {questions[currentQuestion].question}
                </h3>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full p-4 rounded-lg border border-gray-700 hover:border-red-500 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{option.label}</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {currentQuestion === questions.length - 1 && (
                <button
                  onClick={handleComplete}
                  className="w-full mt-6 py-3 px-4 border border-transparent rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-colors"
                >
                  Complete Profile
                </button>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <SpiderChart data={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}