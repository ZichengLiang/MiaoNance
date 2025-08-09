import React, { useMemo } from "react";
import Plot, { PlotMouseEvent } from 'react-plotly.js';
import { ChartMark } from "@/types/note";

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

  // Generate realistic OHLCV data for candlestick charts
  const generateCandlestickData = useMemo(() => (timeframe: string, symbol: string) => {
    const basePrice = symbol === 'BTCUSDT' ? 45000 : symbol === 'ETHUSDT' ? 3000 : 
                      symbol === 'BNBUSDT' ? 300 : symbol === 'ADAUSDT' ? 0.5 :
                      symbol === 'DOTUSDT' ? 8 : symbol === 'SOLUSDT' ? 25 : 100;
    
    const volatility = timeframe === '1m' ? 0.002 : timeframe === '5m' ? 0.005 : 
                      timeframe === '15m' ? 0.01 : timeframe === '1h' ? 0.02 :
                      timeframe === '4h' ? 0.05 : timeframe === '1d' ? 0.1 : 0.2;
    
    const dataPoints = timeframe === '1m' ? 60 : timeframe === '5m' ? 48 :
                      timeframe === '15m' ? 32 : timeframe === '1h' ? 24 :
                      timeframe === '4h' ? 18 : timeframe === '1d' ? 14 : 10;
    
    const data = [];
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = dataPoints; i >= 0; i--) {
      const timeAgo = new Date(now.getTime() - i * getTimeframeMs(timeframe));
      
      // Generate open price
      const open = currentPrice;
      
      // Generate high and low based on volatility
      const maxChange = volatility * basePrice;
      const high = open + Math.random() * maxChange;
      const low = open - Math.random() * maxChange;
      
      // Generate close price (trend slightly upward)
      const trendBias = 0.001; // Slight upward bias
      const change = (Math.random() - 0.5 + trendBias) * 2 * volatility * basePrice;
      const close = Math.max(Math.min(open + change, high), low);
      
      // Update current price for next candle
      currentPrice = close;
      
      // Generate volume (higher volume with bigger price movements)
      const priceMovement = Math.abs(close - open) / open;
      const baseVolume = symbol === 'BTCUSDT' ? 1000 : symbol === 'ETHUSDT' ? 5000 : 10000;
      const volume = baseVolume * (0.5 + priceMovement * 10 + Math.random() * 0.5);
      
      data.push({
        time: timeAgo.toISOString(),
        open: Number(open.toFixed(symbol.includes('USDT') && basePrice < 1 ? 4 : 2)),
        high: Number(high.toFixed(symbol.includes('USDT') && basePrice < 1 ? 4 : 2)),
        low: Number(low.toFixed(symbol.includes('USDT') && basePrice < 1 ? 4 : 2)),
        close: Number(close.toFixed(symbol.includes('USDT') && basePrice < 1 ? 4 : 2)),
        volume: Number(volume.toFixed(0))
      });
    }
    
    return data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, []);

  const getTimeframeMs = (timeframe: string): number => {
    const timeframeMap: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
    };
    return timeframeMap[timeframe] || timeframeMap['1h'];
  };

  // Use provided data or generate sample data
  const chartData = useMemo(() => {
    return data || generateCandlestickData(timeframe, symbol);
  }, [data, timeframe, symbol, generateCandlestickData]);

  // Prepare data for Plotly candlestick chart
  const plotData = useMemo(() => {
    const traces = [
      {
        x: chartData.map(d => d.time),
        open: chartData.map(d => d.open),
        high: chartData.map(d => d.high),
        low: chartData.map(d => d.low),
        close: chartData.map(d => d.close),
        type: 'candlestick' as const,
        name: symbol || 'Price',
        increasing: { line: { color: '#26a69a' } },
        decreasing: { line: { color: '#ef5350' } },
        xaxis: 'x',
        yaxis: 'y',
      },
      {
        x: chartData.map(d => d.time),
        y: chartData.map(d => d.volume),
        type: 'bar' as const,
        name: 'Volume',
        marker: { color: 'rgba(158,158,158,0.8)' },
        xaxis: 'x',
        yaxis: 'y2',
      }
    ];

    return traces;
  }, [chartData, symbol]);

  const layout = useMemo(() => ({
    showlegend: false,
    paper_bgcolor: backgroundColor,
    plot_bgcolor: backgroundColor,
    font: { color: textColor },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: {
      type: 'date' as const,
      showgrid: true,
      gridcolor: 'rgba(128,128,128,0.2)',
      color: textColor,
    },
    yaxis: {
      domain: [0.3, 1],
      showgrid: true,
      gridcolor: 'rgba(128,128,128,0.2)',
      color: textColor,
      title: 'Price',
    },
    yaxis2: {
      domain: [0, 0.25],
      showgrid: false,
      color: textColor,
      title: 'Volume',
    },
    dragmode: 'pan' as const,
    hovermode: 'x unified' as const,
  }), [backgroundColor, textColor]);

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'select2d',
      'lasso2d',
      'toggleSpikelines',
      'hoverClosestCartesian',
      'hoverCompareCartesian'
    ],
    scrollZoom: true,
    responsive: true,
  };

  const handleClick = (event: Readonly<PlotMouseEvent>) => {
    if (onAddMark && event.points && event.points[0]) {
      const point = event.points[0];
      const newMark: ChartMark = {
        time: point.x as string,
        position: 'aboveBar',
        color: '#e91e63',
        shape: 'circle',
        text: '📝',
      };
      onAddMark(newMark);
    }
  };

  return (
    <div className="w-full h-64">
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
        onClick={handleClick}
      />
    </div>
  );
};

// Keep for backward compatibility but not used with candlestick charts
export const initialData = [
  { time: "2018-12-22", open: 32.0, high: 33.0, low: 31.5, close: 32.51, volume: 1000 },
  { time: "2018-12-23", open: 32.51, high: 32.8, low: 30.9, close: 31.11, volume: 1200 },
  { time: "2018-12-24", open: 31.11, high: 31.5, low: 26.8, close: 27.02, volume: 1500 },
];