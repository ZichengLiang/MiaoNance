'use client'
import React, { useState, useEffect } from "react";
import { Note } from "@/types/note";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function NoteSidebar() {
  const [notesBySymbol, setNotesBySymbol] = useState<{ [key: string]: Note[] }>({});
  
  // Sample data - in real app, this would come from context or props
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Bullish Pattern',
        content: 'Seeing strong support at 45k level, possible breakout incoming.',
        symbol: 'BTCUSDT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Resistance Level',
        content: 'Strong resistance at 3200, need to break above for continuation.',
        symbol: 'ETHUSDT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: 'Volume Analysis',
        content: 'Low volume consolidation, waiting for breakout confirmation.',
        symbol: 'BTCUSDT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Group notes by symbol
    const grouped = sampleNotes.reduce((acc, note) => {
      if (!acc[note.symbol]) {
        acc[note.symbol] = [];
      }
      acc[note.symbol].push(note);
      return acc;
    }, {} as { [key: string]: Note[] });

    setNotesBySymbol(grouped);
  }, []);

  const symbols = Object.keys(notesBySymbol);

  return (
    <div className="h-full bg-gray-800 border-l border-gray-700 shadow-lg overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-gray-100">
              Trading Notes
            </h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Notes organized by pairs
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {symbols.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="text-gray-400">
                <DocumentTextIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300">
                  No notes yet. Add charts and create notes to see them here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {symbols.map((symbol) => (
                <div key={symbol} className="bg-gray-700 border border-gray-600 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-600 px-3 py-2 border-b border-gray-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-blue-300">
                        {symbol}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-blue-400 border border-gray-500">
                        {notesBySymbol[symbol].length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="space-y-3">
                      {notesBySymbol[symbol].slice(0, 3).map((note, index) => (
                        <div key={note.id}>
                          <div className="bg-gray-600 rounded p-2">
                            <p className="text-xs font-medium text-gray-200 mb-1">
                              {note.title}
                            </p>
                            <p className="text-xs text-gray-300 line-clamp-2">
                              {note.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {note.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          {index < Math.min(notesBySymbol[symbol].length - 1, 2) && (
                            <hr className="my-2 border-gray-500" />
                          )}
                        </div>
                      ))}
                      
                      {notesBySymbol[symbol].length > 3 && (
                        <p className="text-xs text-gray-400 text-center">
                          +{notesBySymbol[symbol].length - 3} more notes
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}