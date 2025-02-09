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
  candleData: ChartData[];
  aiPrediction: ChartData[];
  trader1: ChartData[];
  trader2: ChartData[];
  trader3: ChartData[];
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  candleData,
  aiPrediction,
  trader1,
  trader2,
  trader3,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const aiPredictionRef = useRef<ISeriesApi<"Line"> | null>(null);
  const realPriceRef = useRef<ISeriesApi<"Line"> | null>(null);
  const trader1Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const trader2Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const trader3Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current || !aiPredictionRef.current) return;

    try {
      candleSeriesRef.current.setData(candleData);
      aiPredictionRef.current.setData(aiPrediction);
      trader1Ref.current?.setData(trader1);
      trader2Ref.current?.setData(trader2);
      trader3Ref.current?.setData(trader3);

      if (realPriceRef.current && candleData.length > 0 && aiPrediction.length > 0) {
        const lastCandle = candleData[candleData.length - 1];
        const lastPrice = lastCandle.close;
        
        const realTimePriceData = [];
        
        realTimePriceData.push({
          time: lastCandle.time,
          value: lastPrice
        });
        
        for (let i = 0; i < aiPrediction.length; i++) {
          realTimePriceData.push({
            time: aiPrediction[i].time,
            value: lastPrice
          });
        }
        
        realPriceRef.current.setData(realTimePriceData);
      }

      const timeScale = chartRef.current.timeScale();
      timeScale.fitContent();
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  }, [candleData, aiPrediction, trader1, trader2, trader3]);

  useEffect(() => {
    if (!chartContainerRef.current || !chartRef.current) return;

    resizeObserverRef.current = new ResizeObserver(entries => {
      if (chartRef.current && entries[0]) {
        try {
          chartRef.current.applyOptions({
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height,
          });
          chartRef.current.timeScale().fitContent();
        } catch (error) {
          if (chartRef.current) {
            console.error('Error resizing chart:', error);
          }
        }
      }
    });

    if (chartContainerRef.current) {
      resizeObserverRef.current.observe(chartContainerRef.current);
    }

    return () => {
      if (resizeObserverRef.current && chartContainerRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

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

    const aiSeries = chart.addLineSeries({
      color: '#a855f7',
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
    });
    aiPredictionRef.current = aiSeries;

    const realPriceLine = chart.addLineSeries({
      color: '#22c55e',
      lineWidth: 2,
      lastValueVisible: true,
      priceLineVisible: true,
      crosshairMarkerVisible: true,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
    });
    realPriceRef.current = realPriceLine;

    const trader1Series = chart.addLineSeries({
      color: 'rgba(128, 128, 128, 0.5)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
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
          return '$' + price.toFixed(2);
        },
        precision: 2,
      },
    });
    trader3Ref.current = trader3Series;

    if (candleData) candleSeries.setData(candleData);
    if (aiPrediction) aiSeries.setData(aiPrediction);
    if (trader1) trader1Series.setData(trader1);
    if (trader2) trader2Series.setData(trader2);
    if (trader3) trader3Series.setData(trader3);

    if (candleData && candleData.length > 0 && aiPrediction && aiPrediction.length > 0) {
      const lastCandle = candleData[candleData.length - 1];
      const lastPrice = lastCandle.close;
      const realTimePriceData = [
        { time: lastCandle.time, value: lastPrice },
        ...aiPrediction.map(p => ({ time: p.time, value: lastPrice }))
      ];
      realPriceLine.setData(realTimePriceData);
    }

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

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-full"
    />
  );
};