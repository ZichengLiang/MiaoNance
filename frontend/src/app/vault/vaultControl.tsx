import { Button } from "@mui/material";
import React from "react";
import { Notebook } from "@/types/notebook";

export default function VaultControl({ notebooks, setNotebooks }) {
  function handleAddNotebook() {
    const timestamp = Date.now();
    const newNotebook = {
      title: "untitled",
      createdAt: new Date(timestamp),
      uuid: crypto.randomUUID(),
    };
    const newArr: Notebook[] = [...notebooks, newNotebook];
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
