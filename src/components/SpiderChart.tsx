import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SpiderChartProps {
  data: {
    riskComfort: number;
    lossTolerance: number;
    timeHorizon: number;
    researchEffort: number;
    leverageAttitude: number;
    tradingFrequency: number;
  };
}

export function SpiderChart({ data }: SpiderChartProps) {
  const chartData = {
    labels: [
      'Risk Comfort',
      'Loss Tolerance',
      'Time Horizon',
      'Research Effort',
      'Leverage Attitude',
      'Trading Frequency',
    ],
    datasets: [
      {
        label: 'Your Trading Profile',
        data: [
          data.riskComfort,
          data.lossTolerance,
          data.timeHorizon,
          data.researchEffort,
          data.leverageAttitude,
          data.tradingFrequency,
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(239, 68, 68, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
        ticks: {
          display: false, // Hide the numerical values
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[400px] w-full">
      <Radar data={chartData} options={options} />
    </div>
  );
}