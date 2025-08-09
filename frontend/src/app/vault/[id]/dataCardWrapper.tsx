'use client'
import React, { useState, useEffect } from "react";
import DataCard from "./dataCard";
import DataCardDialog from "./dataCardDialog";
import { DataCard as DataCardType, DataCardCreateInput, DataCardUpdateInput, TIMEFRAMES } from "@/types/dataCard";
import { PlusIcon, ClockIcon } from "@heroicons/react/24/outline";

interface DataCardWrapperProps {
  notebookId: string; // Notebook ID for localStorage key
  onExpandCard?: (card: DataCardType) => void;
}

export default function DataCardWrapper({ notebookId, onExpandCard }: DataCardWrapperProps) {
  const [cards, setCards] = useState<DataCardType[]>([]);
  const [globalTimeframe, setGlobalTimeframe] = useState<string>('1h');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingCard, setEditingCard] = useState<DataCardType | undefined>();

  // Load cards from localStorage on mount
  useEffect(() => {
    const storageKey = `notebook-${notebookId}-cards`;
    const savedCards = localStorage.getItem(storageKey);
    if (savedCards) {
      try {
        const parsedCards: DataCardType[] = JSON.parse(savedCards).map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        }));
        setCards(parsedCards);
      } catch (error) {
        console.error('Failed to parse saved cards:', error);
        setCards([]);
      }
    }
  }, [notebookId]);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    try {
      const storageKey = `notebook-${notebookId}-cards`;
      localStorage.setItem(storageKey, JSON.stringify(cards));
    } catch (error) {
      console.error('Failed to save cards to localStorage:', error);
    }
  }, [cards, notebookId]);

  // Calculate grid layout - max 2 columns
  const cardCount = cards.length;
  
  // Always use max 2 columns, scroll when more than 2 rows (4 cards)
  const getGridClass = () => {
    if (cardCount === 0) return '';
    if (cardCount === 1) return 'grid-cols-1';
    return 'grid-cols-1 md:grid-cols-2';
  };

  const gridClass = getGridClass();
  const shouldScroll = cardCount > 4;

  // CRUD Operations
  const handleAddCard = () => {
    setDialogMode('create');
    setEditingCard(undefined);
    setDialogOpen(true);
  };

  const handleEditCard = (card: DataCardType) => {
    setDialogMode('edit');
    setEditingCard(card);
    setDialogOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    }
  };

  const handleSaveCard = (data: DataCardCreateInput | DataCardUpdateInput) => {
    if (dialogMode === 'create') {
      const newCard: DataCardType = {
        id: crypto.randomUUID(),
        title: data.symbol || 'Unnamed Chart', // Auto-generate from symbol
        chartType: (data as DataCardCreateInput).chartType,
        symbol: data.symbol,
        timeframe: data.timeframe,
        useGlobalTimeframe: data.useGlobalTimeframe ?? true,
        data: undefined, // Let chart generate data based on timeframe
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCards(prevCards => [...prevCards, newCard]);
    } else if (dialogMode === 'edit' && editingCard) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === editingCard.id
            ? {
                ...card,
                ...data,
                title: data.symbol || card.title, // Update title to match symbol
                updatedAt: new Date(),
              }
            : card
        )
      );
    }
  };


  // Handle global timeframe change
  const handleGlobalTimeframeChange = (newTimeframe: string) => {
    setGlobalTimeframe(newTimeframe);
  };

  // Quick function to sync all cards to global timeframe
  const syncAllToGlobal = () => {
    setCards(prevCards =>
      prevCards.map(card => ({
        ...card,
        useGlobalTimeframe: true,
        updatedAt: new Date(),
      }))
    );
  };

  // Get count of cards using global vs individual timeframes
  const globalCards = cards.filter(card => card.useGlobalTimeframe).length;
  const individualCards = cards.length - globalCards;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-gray-900">
      <header className="border border-gray-700 rounded-xl p-6 mb-6 bg-gray-800 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-2xl text-gray-100">Chart Dashboard</h2>
            {cards.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200 border border-gray-600">
                {globalCards} Global • {individualCards} Individual
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Global Timeframe Selector */}
            {cards.length > 0 && (
              <>
                <div className="relative">
                  <select
                    value={globalTimeframe}
                    onChange={(e) => handleGlobalTimeframeChange(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 text-gray-200 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  >
                    {TIMEFRAMES.map((tf) => (
                      <option key={tf.value} value={tf.value}>
                        {tf.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {individualCards > 0 && (
                  <button
                    onClick={syncAllToGlobal}
                    className="px-3 py-2 text-sm font-medium text-blue-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  >
                    Sync All
                  </button>
                )}
              </>
            )}
            
            {/* Add Trading Pair Button */}
            <button
              onClick={handleAddCard}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Pair
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col min-h-0">
        {cards.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl bg-gray-800">
            <div className="text-center text-gray-400">
            <div className="mb-4">
                <ClockIcon className="w-12 h-12 text-gray-500 mx-auto" />
            </div>
              <p className="text-lg mb-2 text-gray-300">No trading pairs added yet</p>
              <p className="text-sm mb-6 text-gray-500">Add your first trading pair to start analyzing crypto data</p>
            <button
              onClick={handleAddCard}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Trading Pair
            </button>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 flex flex-col min-h-0">
            <div 
              className={`flex-1 ${shouldScroll ? 'overflow-y-auto' : ''} ${shouldScroll ? 'pr-2 custom-scrollbar' : ''}`}
              style={shouldScroll ? {
                scrollbarWidth: 'thin',
                scrollbarColor: '#6b7280 #374151',
              } : {}}
            >
              <div className={`grid ${gridClass} gap-6 ${shouldScroll ? 'pb-4' : ''} h-full`}>
                {cards.map((card) => (
                  <DataCard
                    key={card.id}
                    card={card}
                    globalTimeframe={globalTimeframe}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                    onExpand={onExpandCard}
                  />
                ))}
              </div>
            </div>
            
            {/* Fade indicator at bottom when scrollable */}
            {shouldScroll && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
            )}
          </div>
        )}
      </div>

      <DataCardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCard}
        card={editingCard}
        mode={dialogMode}
        globalTimeframe={globalTimeframe}
      />
    </div>
  );
}
