// components/DataCard.tsx
import React from 'react';

interface DataCardProps {
  id: string | number; // Unique identifier for the card
  className?: string;   // To allow additional custom styling
  children?: React.ReactNode; // Optional children for more content
}

const DataCard: React.FC<DataCardProps> = ({ id, className, children }) => {
  return (
    <div
      className={`aspect-[3/2] bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-slate-200 ${className || ''}`}
    >
      <span className="text-lg font-semibold"> DataCard {id}</span>
      {children && <div className="mt-2 text-sm">{children}</div>}
    </div>
  );
};

export default DataCard;