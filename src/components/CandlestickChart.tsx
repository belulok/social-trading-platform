import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';

interface ChartData {
  time: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  value?: number;
}

interface CandlestickChartProps {
  getData: () => Promise<{
    historical: ChartData[];
    aiPrediction: ChartData[];
    trader1: ChartData[];
    trader2: ChartData[];
    trader3: ChartData[];
  }>;
}

export function CandlestickChart({ getData }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const aiPredictionRef = useRef<ISeriesApi<"Line"> | null>(null);
  const trader1Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const trader2Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const trader3Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.7)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: 'rgba(255, 255, 255, 0.4)',
          width: 1,
          style: LineStyle.Dotted,
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.4)',
          width: 1,
          style: LineStyle.Dotted,
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    chartRef.current = chart;

    // Add candlestick series for current price
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    candleSeriesRef.current = candleSeries;

    // Add AI prediction series (purple)
    const aiSeries = chart.addLineSeries({
      color: '#a855f7',
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
    });
    aiPredictionRef.current = aiSeries;

    // Add trader series (initially gray)
    const trader1Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
    });
    trader1Ref.current = trader1Series;

    const trader2Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
    });
    trader2Ref.current = trader2Series;

    const trader3Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
    });
    trader3Ref.current = trader3Series;

    // Add hover effects for trader lines
    chartContainerRef.current.addEventListener('mouseover', () => {
      setIsHovering(true);
      if (trader1Ref.current) trader1Ref.current.applyOptions({ color: '#eab308' }); // yellow
      if (trader2Ref.current) trader2Ref.current.applyOptions({ color: '#ef4444' }); // red
      if (trader3Ref.current) trader3Ref.current.applyOptions({ color: '#3b82f6' }); // blue
    });

    chartContainerRef.current.addEventListener('mouseout', () => {
      setIsHovering(false);
      if (trader1Ref.current) trader1Ref.current.applyOptions({ color: 'rgba(128, 128, 128, 0.5)' });
      if (trader2Ref.current) trader2Ref.current.applyOptions({ color: 'rgba(128, 128, 128, 0.5)' });
      if (trader3Ref.current) trader3Ref.current.applyOptions({ color: 'rgba(128, 128, 128, 0.5)' });
    });

    // Initial data fetch
    updateChartData();

    return () => {
      chart.remove();
    };
  }, []);

  const updateChartData = async () => {
    const data = await getData();
    
    if (candleSeriesRef.current && data.historical) {
      candleSeriesRef.current.setData(data.historical);
    }

    if (aiPredictionRef.current && data.aiPrediction) {
      aiPredictionRef.current.setData(data.aiPrediction);
    }

    if (trader1Ref.current && data.trader1) {
      trader1Ref.current.setData(data.trader1);
    }

    if (trader2Ref.current && data.trader2) {
      trader2Ref.current.setData(data.trader2);
    }

    if (trader3Ref.current && data.trader3) {
      trader3Ref.current.setData(data.trader3);
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(updateChartData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}