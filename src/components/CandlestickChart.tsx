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
        mode: 0,
        autoScale: true,
        alignLabels: true,
        borderVisible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 12,
        minBarSpacing: 8,
        rightOffset: 5,
        fixLeftEdge: true,
        fixRightEdge: true,
        visible: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
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
    });

    chartRef.current = chart;

    // Add candlestick series for current price
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceLineVisible: false,
      lastValueVisible: false,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price >= 1000) {
            return '$' + price.toFixed(2);
          }
          return '$' + price.toFixed(2);
        },
        precision: 2,
        minMove: 0.01,
      },
    });
    candleSeriesRef.current = candleSeries;

    // Add AI prediction series (purple)
    const aiSeries = chart.addLineSeries({
      color: '#a855f7',
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price >= 1000) {
            return '$' + price.toFixed(2);
          }
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
    });
    aiPredictionRef.current = aiSeries;

    // Add trader series (initially gray)
    const trader1Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price >= 1000) {
            return '$' + price.toFixed(2);
          }
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
    });
    trader1Ref.current = trader1Series;

    const trader2Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price >= 1000) {
            return '$' + price.toFixed(2);
          }
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
    });
    trader2Ref.current = trader2Series;

    const trader3Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price >= 1000) {
            return '$' + price.toFixed(2);
          }
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
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

    const updateData = async () => {
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
        const timeScale = chartRef.current.timeScale();
        const visibleRange = timeScale.getVisibleRange();
        timeScale.fitContent();
        if (visibleRange) {
          timeScale.setVisibleRange(visibleRange);
        }
      }
    };

    // Initial update
    updateData();

    // Update every 1 second
    const interval = setInterval(updateData, 1000);

    // Resize observer
    const resizeObserver = new ResizeObserver(entries => {
      if (chartRef.current) {
        const timeScale = chartRef.current.timeScale();
        const visibleRange = timeScale.getVisibleRange();
        chartRef.current.applyOptions({
          timeScale: {
            barSpacing: 12,
            timeVisible: true,
            secondsVisible: false,
          },
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
        if (visibleRange) {
          timeScale.setVisibleRange(visibleRange);
        }
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      chart.remove();
      clearInterval(interval);
      resizeObserver.unobserve(chartContainerRef.current);
    };
  }, [getData]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}