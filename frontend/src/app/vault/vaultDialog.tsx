import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { NotebookMetadata } from "@/types/notebook_metadata";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notebook: NotebookMetadata;
  variant: string;
  handleEdit: (notebook: NotebookMetadata, title: string) => void;
  handleDelete: (notebook: NotebookMetadata, title: string) => boolean;
}

export default function VaultDialog({
  isOpen,
  setIsOpen,
  notebook,
  variant,
  handleEdit,
  handleDelete,
}: DialogProps) {
  const [deleteValidated, setDeleteValidated] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setDeleteValidated(true);
  };

  function getDialogTitle(variant: string) {
    switch (variant) {
      case "edit":
        return "Rename Notebook";
      case "delete":
        return "Delete Notebook";
      default:
        return "Error: not a valid variant (app/vault/vaultDialog.tsx)";
    }
  }

  function getDialogContent(variant: string) {
    switch (variant) {
      case "edit":
        return "Please type in your preferred notebook title:";
      case "delete":
        return (
          <div>
            <p>
              Please type in the notebook title{" "}
              <span className="font-bold">{notebook.title}</span> to confirm deletion:
            </p>
            {!deleteValidated && (
              <p className="text-red-600 mt-2">
                ⚠️ The title doesn&apos;t match. Please check your spelling and capitalization.
              </p>
            )}
          </div>
        );
      default:
        return "Error: not a valid variant (app/vault/vaultDialog.tsx)";
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get the user input from the submission
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    const userInput = formJson.title;
    // Now the user input is ready, run the logic...
    let shouldClose = true;
    switch (variant) {
      case "edit":
        handleEdit(notebook, userInput);
        break;
      case "delete":
        // Here handleDelete verify the user input with the notebook name
        // shouldClose will be true if it's validated
        shouldClose = handleDelete(notebook, userInput);
        setDeleteValidated(shouldClose);
        break;
      default:
        break;
    }
    if (shouldClose) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-md space-y-4 border bg-white p-6 rounded-lg shadow-lg">
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
            {variant === "delete" && (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            )}
            <span className={variant === "delete" ? "text-red-600" : ""}>
              {getDialogTitle(variant)}
            </span>
          </DialogTitle>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-gray-500">
              {getDialogContent(variant)}
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {variant === "edit" ? "New Notebook Title" : "Notebook Title"}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                autoFocus
                data-testid="content-input"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Confirm
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
