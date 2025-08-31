import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { NotebookMetadata } from "@/types/notebook_metadata";
import { v4 as uuidv4 } from "uuid";

interface VaultControlProps {
  notebooks: NotebookMetadata[];
  // the type React.Dispatch... is used for React setState(), it allows both direct state updates and functional updates.
  setNotebooks: React.Dispatch<React.SetStateAction<NotebookMetadata[]>>;
}

export default function VaultControl({
  notebooks,
  setNotebooks,
}: VaultControlProps) {
  function handleAddNotebook() {
    const timestamp = Date.now();
    const newNotebookMetadata = {
      title: "untitled",
      createdAt: new Date(timestamp),
      updatedAt: new Date(timestamp),
      uuid: uuidv4(),
    };
    const newArr: NotebookMetadata[] = [...notebooks, newNotebookMetadata];
    setNotebooks(newArr);
  }
  return (
    <div className="mx-32 pb-6 pt-3">
      <button 
        onClick={handleAddNotebook}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Add a new notebook
      </button>
    </div>
  );
}
