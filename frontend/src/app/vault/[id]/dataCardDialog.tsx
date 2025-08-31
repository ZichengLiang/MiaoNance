import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { DataCard, DataCardCreateInput, DataCardUpdateInput, TIMEFRAMES } from "@/types/dataCard";
import { symbols } from "@/lib/symbols";

interface DataCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DataCardCreateInput | DataCardUpdateInput) => void;
  card?: DataCard; // If provided, it's edit mode
  mode: 'create' | 'edit';
  globalTimeframe: string; // Current global timeframe for reference
}

export default function DataCardDialog({
  open,
  onClose,
  onSave,
  card,
  mode,
  globalTimeframe
}: DataCardDialogProps) {
  const [formData, setFormData] = useState<DataCardCreateInput>({
    title: '', // Keep for backend compatibility but won't show in UI
    symbol: '',
    timeframe: '1h',
    useGlobalTimeframe: true
  });

  useEffect(() => {
    if (mode === 'edit' && card) {
      setFormData({
        title: card.title,
        symbol: card.symbol || '',
        timeframe: card.timeframe || '1h',
        useGlobalTimeframe: card.useGlobalTimeframe ?? true
      });
    } else {
      setFormData({
        title: '',
        symbol: '',
        timeframe: '1h',
        useGlobalTimeframe: true
      });
    }
  }, [mode, card, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-generate title from symbol for backend compatibility
    const submitData = {
      ...formData,
      title: formData.symbol || 'Unnamed Chart'
    };
    onSave(submitData);
    onClose();
  };

  const handleChange = (field: keyof DataCardCreateInput, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full space-y-4 border bg-white p-6 rounded-lg shadow-lg">
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
            {mode === 'create' ? 'Add New Chart Card' : 'Edit Chart Card'}
          </DialogTitle>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                Trading Pair *
              </label>
              <select
                id="symbol"
                required
                autoFocus
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {symbols?.map(symbol => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
                
                </select>
              <p className="mt-1 text-xs text-gray-500">Select the symbol</p>
            </div>
            
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.useGlobalTimeframe}
                  onChange={(e) => handleChange('useGlobalTimeframe', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Use Global Timeframe</span>
                  <p className="text-xs text-gray-500">
                    {formData.useGlobalTimeframe 
                      ? `Will use global timeframe (currently ${globalTimeframe})`
                      : 'Will use individual timeframe set below'
                    }
                  </p>
                </div>
              </label>
            </div>
            
            {!formData.useGlobalTimeframe && (
              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                  Individual Timeframe
                </label>
                <div className="relative">
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => handleChange('timeframe', e.target.value)}
                    className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {TIMEFRAMES.map((tf) => (
                      <option key={tf.value} value={tf.value}>
                        {tf.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {mode === 'create' ? 'Add Card' : 'Save Changes'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}