import React from "react";
import NoteCard from "./noteCard";
import { NotebookMetadata } from "@/types/notebook_metadata";
import { v4 as uuidv4 } from "uuid";

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
          key={uuidv4()}
          notebook={notebook}
          notebooks={notebooks}
          setNotebooks={setNotebooks}
        />
      ))}
    </div>
  );
}
