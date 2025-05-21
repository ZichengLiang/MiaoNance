import { Button } from "@mui/material";
import React from "react";
import { NotebookMetadata } from "@/types/notebook_metadata";

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
      uuid: crypto.randomUUID(),
    };
    const newArr: NotebookMetadata[] = [...notebooks, newNotebookMetadata];
    setNotebooks(newArr);
  }
  return (
    <div className="mx-32 pb-6 pt-3">
      <Button
        variant="outlined"
        onClick={() => {
          handleAddNotebook();
        }}
      >
        Add a new notebook
      </Button>
    </div>
  );
}
