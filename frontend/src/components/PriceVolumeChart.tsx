import React, { useEffect, useRef, useMemo } from "react";
import { createChart, ColorType } from 'lightweight-charts';
import { ChartMark } from "@/types/note";
import { mockUIKlines } from "@/app/data/mockData";

interface PriceVolumeChartProps {
  data?: Array<{ time: string | number; open: number; high: number; low: number; close: number; volume: number }>;
  timeframe?: string;
  symbol?: string;
  marks?: ChartMark[];
  onAddMark?: (mark: ChartMark) => void;
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const PriceVolumeChart = (props: PriceVolumeChartProps) => {
  const {
    data,
    timeframe = '1h',
    symbol = '',
    onAddMark,
    colors: {
      backgroundColor = "white",
      textColor = "black",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  // Convert Binance kline data to chart format
  const convertBinanceKlineData = useMemo(() => {
    try {
      const klineData = JSON.parse(mockUIKlines);
      const candlestickData: any[] = [];
      const volumeData: any[] = [];

      klineData.forEach((kline: any[]) => {
        const time = Math.floor(kline[0] / 1000); // Convert to seconds
        const open = parseFloat(kline[1]);
        const high = parseFloat(kline[2]);
        const low = parseFloat(kline[3]);
        const close = parseFloat(kline[4]);
        const volume = parseFloat(kline[5]);

        candlestickData.push({ time, value: close });
        volumeData.push({ time, value: volume });
      });

      return { candlestickData, volumeData };
    } catch (error) {
      console.error('Error parsing kline data:', error);
      return generateSampleData();
    }
  }, []);

  // Generate sample data if no mock data available
  const generateSampleData = () => {
    const basePrice = symbol === 'BTCUSDT' ? 45000 : symbol === 'ETHUSDT' ? 3000 : 
                     symbol === 'BNBUSDT' ? 300 : symbol === 'ADAUSDT' ? 0.5 :
                     symbol === 'DOTUSDT' ? 8 : symbol === 'SOLUSDT' ? 25 : 100;
    
    const volatility = timeframe === '1m' ? 0.002 : timeframe === '5m' ? 0.005 : 
                      timeframe === '15m' ? 0.01 : timeframe === '1h' ? 0.02 :
                      timeframe === '4h' ? 0.05 : timeframe === '1d' ? 0.1 : 0.2;
    
    const dataPoints = 50;
    
    const candlestickData: any[] = [];
    const volumeData: any[] = [];
    let currentPrice = basePrice;
    const now = Math.floor(Date.now() / 1000);
    
    for (let i = dataPoints; i >= 0; i--) {
      const time = now - i * getTimeframeSeconds(timeframe);
      
      const open = currentPrice;
      const maxChange = volatility * basePrice;
      const high = open + Math.random() * maxChange;
      const low = open - Math.random() * maxChange;
      const trendBias = 0.001;
      const change = (Math.random() - 0.5 + trendBias) * 2 * volatility * basePrice;
      const close = Math.max(Math.min(open + change, high), low);
      
      currentPrice = close;
      
      const priceMovement = Math.abs(close - open) / open;
      const baseVolume = symbol === 'BTCUSDT' ? 1000 : symbol === 'ETHUSDT' ? 5000 : 10000;
      const volume = baseVolume * (0.5 + priceMovement * 10 + Math.random() * 0.5);
      
      candlestickData.push({ time, value: close });
      volumeData.push({ time, value: volume });
    }
    
    return { candlestickData, volumeData };
  };

  const getTimeframeSeconds = (timeframe: string): number => {
    const timeframeMap: { [key: string]: number } = {
      '1m': 60,
      '5m': 5 * 60,
      '15m': 15 * 60,
      '1h': 60 * 60,
      '4h': 4 * 60 * 60,
      '1d': 24 * 60 * 60,
      '1w': 7 * 24 * 60 * 60,
    };
    return timeframeMap[timeframe] || timeframeMap['1h'];
  };

  // Get chart data
  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      // Convert provided data to TradingView format
      const candlestickData: any[] = data.map(d => ({
        time: typeof d.time === 'string' ? Math.floor(new Date(d.time).getTime() / 1000) : d.time,
        value: d.close
      }));
      
      const volumeData: any[] = data.map(d => ({
        time: typeof d.time === 'string' ? Math.floor(new Date(d.time).getTime() / 1000) : d.time,
        value: d.volume
      }));
      
      return { candlestickData, volumeData };
    }
    return convertBinanceKlineData;
  }, [data, convertBinanceKlineData]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 256,
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.5)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.5)' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
    });

    chartRef.current = chart;

    // Add line series (TradingView Lightweight Charts uses different API)
    const lineSeries = chart.addLineSeries({
      color: '#26a69a',
      lineWidth: 2,
    });
    candlestickSeriesRef.current = lineSeries;

    // Add volume series as area series
    const volumeSeries = chart.addAreaSeries({
      topColor: 'rgba(38, 166, 154, 0.28)',
      bottomColor: 'rgba(38, 166, 154, 0.05)',
      lineColor: 'rgba(38, 166, 154, 1)',
      lineWidth: 2,
    });
    volumeSeriesRef.current = volumeSeries;

    // Configure volume price scale (commented out for now)
    // chart.priceScale('volume').applyOptions({
    //   scaleMargins: {
    //     top: 0.7,
    //     bottom: 0,
    //   },
    // });

    // Set data
    lineSeries.setData(chartData.candlestickData);
    volumeSeries.setData(chartData.volumeData);

    // Handle click events for adding marks
    if (onAddMark) {
      chart.subscribeClick((param) => {
        if (param.time) {
          const newMark: ChartMark = {
            time: typeof param.time === 'number' ? new Date(param.time * 1000).toISOString() : param.time.toString(),
            position: 'aboveBar',
            color: '#e91e63',
            shape: 'circle',
            text: '📝',
          };
          onAddMark(newMark);
        }
      });
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartData, backgroundColor, textColor, onAddMark]);

  // Add marks to chart
  useEffect(() => {
    if (props.marks && candlestickSeriesRef.current) {
      const chartMarks = props.marks.map(mark => ({
        time: typeof mark.time === 'string' ? Math.floor(new Date(mark.time).getTime() / 1000) : mark.time,
        position: mark.position === 'aboveBar' ? 'aboveBar' as const : 'belowBar' as const,
        color: mark.color,
        shape: mark.shape === 'circle' ? 'circle' as const : 'square' as const,
        text: mark.text,
      }));
      candlestickSeriesRef.current.setMarkers(chartMarks);
    }
  }, [props.marks]);

  return (
    <div className="w-full h-64">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};