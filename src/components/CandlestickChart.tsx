import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  predictiveData?: CandlestickData[];
  communityData?: CandlestickData[];
}

export function CandlestickChart({ data, predictiveData, communityData }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const aiSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const communitySeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

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
          style: 3,
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.4)',
          width: 1,
          style: 3,
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    // Add historical candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Format dates and ensure ascending order
    const formattedData = data
      .map(item => ({
        ...item,
        time: item.time.split('T')[0]
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    candlestickSeries.setData(formattedData);
    candlestickSeriesRef.current = candlestickSeries;

    // Add AI prediction series if available
    if (predictiveData && predictiveData.length > 0) {
      const aiSeries = chart.addCandlestickSeries({
        upColor: 'rgba(147, 51, 234, 0.8)',
        downColor: 'rgba(147, 51, 234, 0.8)',
        borderVisible: false,
        wickUpColor: 'rgba(147, 51, 234, 0.8)',
        wickDownColor: 'rgba(147, 51, 234, 0.8)',
      });

      const formattedPredictiveData = predictiveData
        .map(item => ({
          ...item,
          time: item.time.split('T')[0]
        }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      aiSeries.setData(formattedPredictiveData);
      aiSeriesRef.current = aiSeries;
    }

    // Add community prediction series if available
    if (communityData && communityData.length > 0) {
      const communitySeries = chart.addCandlestickSeries({
        upColor: 'rgba(34, 197, 94, 0.8)',
        downColor: 'rgba(34, 197, 94, 0.8)',
        borderVisible: false,
        wickUpColor: 'rgba(34, 197, 94, 0.8)',
        wickDownColor: 'rgba(34, 197, 94, 0.8)',
      });

      const formattedCommunityData = communityData
        .map(item => ({
          ...item,
          time: item.time.split('T')[0]
        }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      communitySeries.setData(formattedCommunityData);
      communitySeriesRef.current = communitySeries;
    }

    chartRef.current = chart;

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, predictiveData, communityData]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}