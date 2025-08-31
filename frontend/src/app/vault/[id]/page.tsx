'use client'
import { useState } from "react";
import { useParams } from "next/navigation";
import DataCardWrapper from "./dataCardWrapper";
import NoteSidebar from "./noteSidebar";
import ExpandedChart from "./expandedChart";
import { DataCard } from "@/types/dataCard";

export default function Page() {
  const params = useParams();
  const notebookId = params.id as string;
  const [expandedCard, setExpandedCard] = useState<DataCard | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Expanded Chart Overlay */}
      {expandedCard && (
        <ExpandedChart 
          card={expandedCard} 
          onClose={() => setExpandedCard(null)}
        />
      )}
      
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Side - Data Cards */}
        <div className="flex-1 lg:w-1/2 h-full overflow-hidden">
          <DataCardWrapper 
            notebookId={notebookId} 
            onExpandCard={setExpandedCard} 
            onSymbolChange={setSelectedSymbol}
          />
        </div>
        
        {/* Right Side - Notes */}
        <div className="flex-1 lg:w-1/2 h-full overflow-hidden">
          <NoteSidebar notebookId={notebookId} selectedSymbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}
