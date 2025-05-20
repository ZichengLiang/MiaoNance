import React from "react";
import NoteCard from "./noteCard";
import { Notebook } from "@/types/notebook";

interface NoteCardWrapperProps {
  notebooks: Notebook[];
  setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>;
}

export default function NoteCardWrapper({
  notebooks,
  setNotebooks,
}: NoteCardWrapperProps) {
  return (
    <div className="mx-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {notebooks.map((notebook: Notebook) => (
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
