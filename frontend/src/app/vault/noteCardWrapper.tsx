import React from "react";
import NoteCard from "./noteCard";
import { NotebookMetadata } from "@/types/notebook_metadata";

interface NoteCardWrapperProps {
  notebooks: NotebookMetadata[];
  setNotebooks: React.Dispatch<React.SetStateAction<NotebookMetadata[]>>;
}

export default function NoteCardWrapper({
  notebooks,
  setNotebooks,
}: NoteCardWrapperProps) {

  return (
    <div className="mx-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {notebooks && notebooks.map((notebook: NotebookMetadata) => (
        <NoteCard
          key={crypto.randomUUID()}
          notebook={notebook}
          notebooks={notebooks}
          setNotebooks={setNotebooks}
        />
      ))}
    </div>
  );
}
