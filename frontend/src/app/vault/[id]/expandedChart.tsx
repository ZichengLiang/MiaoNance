'use client'
import React, { useState } from "react";
import { PriceVolumeChart } from "@/components/PriceVolumeChart";
import { DataCard } from "@/types/dataCard";
import { Note, ChartMark } from "@/types/note";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import NotesGrid from "./notesGrid";

interface ExpandedChartProps {
  card: DataCard;
  onClose: () => void;
}

export default function ExpandedChart({ card, onClose }: ExpandedChartProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [marks, setMarks] = useState<ChartMark[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  // Handle note operations
  const handleAddNote = () => {
    setEditingNote(undefined);
    setNewNoteTitle("");
    setNewNoteContent("");
    setDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setDialogOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    }
  };

  const handleSaveNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    if (editingNote) {
      // Update existing note
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === editingNote.id
            ? {
                ...note,
                title: newNoteTitle,
                content: newNoteContent,
                updatedAt: new Date(),
              }
            : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: newNoteTitle,
        content: newNoteContent,
        symbol: card.symbol || card.title,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prevNotes => [...prevNotes, newNote]);
    }

    setDialogOpen(false);
    setNewNoteTitle("");
    setNewNoteContent("");
    setEditingNote(undefined);
  };

  // Handle mark operations
  const handleAddMark = (mark: ChartMark) => {
    setMarks(prevMarks => [...prevMarks, mark]);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {card.symbol || card.title}
          </h1>
          <p className="text-sm text-gray-500">
            Expanded Chart View
          </p>
        </div>
        <button 
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Content Split View */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Upper Half - Chart */}
        <div className="flex-1 min-h-0 p-6">
          <div className="h-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <PriceVolumeChart
              timeframe={card.useGlobalTimeframe ? undefined : card.timeframe}
              symbol={card.symbol}
              data={card.data}
              marks={marks}
              onAddMark={handleAddMark}
            />
          </div>
        </div>

        {/* Lower Half - Notes */}
        <div className="flex-1 min-h-0 p-6 pt-0">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Notes for {card.symbol || card.title}
              </h2>
              <button
                onClick={handleAddNote}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Note
              </button>
            </div>
            
            <div className="flex-1 min-h-0">
              <NotesGrid 
                notes={notes}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Note Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full space-y-4 border bg-white p-6 rounded-lg shadow-lg">
            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </DialogTitle>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Note Title
                </label>
                <input
                  id="noteTitle"
                  type="text"
                  autoFocus
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Note Content
                </label>
                <textarea
                  id="noteContent"
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {editingNote ? 'Update' : 'Add'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}