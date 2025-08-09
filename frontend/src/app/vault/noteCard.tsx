import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { NotebookMetadata } from "@/types/notebook_metadata";
import VaultDialog from "./vaultDialog";

interface NoteCardProps {
  notebook: NotebookMetadata;
  notebooks: NotebookMetadata[];
  // the type React.Dispatch... is used for React setState(), it allows both direct state updates and functional updates.
  setNotebooks: React.Dispatch<React.SetStateAction<NotebookMetadata[]>>;
}

export default function NoteCard({
  notebook,
  notebooks,
  setNotebooks,
}: NoteCardProps) {
  // states
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogVariant, setDialogVariant] = React.useState('edit');

  // functions
  function invokeDialog(variant: 'delete' | 'edit') {
    setOpenDialog(true);
    setDialogVariant(variant);
  }

  function handleEdit(notebook: NotebookMetadata, title: string) {
    // A helper function when we edit the title
    function editTitle(target: NotebookMetadata): NotebookMetadata {
      // Leave non-target item alone...
      if (notebook.uuid !== target.uuid) {
        return { ...target };
      }
      // Leave everything else the same, only change the title
      return {
        ...target,
        title: title,
      };
    }

    const newNotebooks: NotebookMetadata[] = notebooks.map(editTitle);
    setNotebooks(newNotebooks);
  }

  function handleDelete(notebook: NotebookMetadata, title:string) {
    const inputOK = title === notebook.title;
    if (inputOK) {
      setNotebooks(notebooks.filter((item) => item.uuid !== notebook.uuid));
    }
    return inputOK;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 max-w-md group">
        <Link href={`/vault/${notebook.uuid}`} className="block">
          <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {notebook.title}
            </h3>
            <p className="text-sm text-gray-500">
              {notebook.createdAt.toLocaleDateString()}
            </p>
          </div>
        </Link>
        <div className="flex justify-end gap-2 p-4 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            onClick={() => invokeDialog('edit')}
            title="Rename this notebook"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
            onClick={() => invokeDialog('delete')}
            title="Delete this notebook"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <VaultDialog
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
        variant={dialogVariant}
        notebook={notebook}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
}
