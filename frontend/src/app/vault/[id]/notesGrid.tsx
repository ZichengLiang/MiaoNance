'use client'
import React from "react";
import { Note } from "@/types/note";
import { PencilIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";

interface NotesGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NotesGrid({ notes, onEdit, onDelete }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="mb-4">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto" />
          </div>
          <p className="text-lg mb-2">No notes yet</p>
          <p className="text-sm text-gray-400">Add your first note to start tracking your analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="p-4 relative">
              {/* Hover Controls */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <button 
                  onClick={() => onEdit(note)}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors bg-white/90 backdrop-blur-sm"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(note.id)}
                  className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors bg-white/90 backdrop-blur-sm"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-16">
                {note.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {note.content}
              </p>
              
              <p className="text-xs text-gray-500">
                {note.createdAt.toLocaleDateString()} {note.createdAt.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}