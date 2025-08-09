'use client'
// components/DataCard.tsx
import React from "react";
import { PriceVolumeChart } from "@/components/PriceVolumeChart";
import { DataCard as DataCardType } from "@/types/dataCard";
import { PencilIcon, TrashIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

interface DataCardProps {
  card: DataCardType;
  className?: string;
  globalTimeframe: string;
  onEdit: (card: DataCardType) => void;
  onDelete: (cardId: string) => void;
  onExpand?: (card: DataCardType) => void;
  children?: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ card, className, globalTimeframe, onEdit, onDelete, onExpand, children }) => {
  // Get the effective timeframe for this card
  const effectiveTimeframe = card.useGlobalTimeframe ? globalTimeframe : (card.timeframe || globalTimeframe);
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group ${
        className || ""
      }`}
    >
      {/* Card Header with Trading Pair and Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        {/* Left side - Trading Pair */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800">
            {card.symbol || 'No Symbol'}
          </h3>
        </div>
        
        {/* Right side - Timeframe and Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Timeframe indicator */}
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${card.useGlobalTimeframe ? 'text-blue-600' : 'text-orange-600'}`}>
              {effectiveTimeframe}
            </span>
            {card.useGlobalTimeframe ? (
              <span 
                className="text-blue-600 text-xs cursor-help"
                title="Using global timeframe"
              >
                ●
              </span>
            ) : (
              <span 
                className="text-orange-600 text-xs cursor-help"
                title="Using individual timeframe"
              >
                ●
              </span>
            )}
          </div>
          
          {/* Control buttons */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
            {onExpand && (
              <button
                className="flex items-center justify-center w-8 h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
                onClick={() => onExpand(card)}
                title="Expand chart"
              >
                <ArrowsPointingOutIcon className="w-4 h-4" />
              </button>
            )}
            <button
              className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => onEdit(card)}
              title="Edit card"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              onClick={() => onDelete(card.id)}
              title="Delete card"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full p-3">
        <PriceVolumeChart 
          data={card.data}
          timeframe={effectiveTimeframe}
          symbol={card.symbol}
        />
      </div>

      {children && <div className="px-4 pb-3 text-sm text-gray-600">{children}</div>}
    </div>
  );
};

export default DataCard;
