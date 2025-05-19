import React from "react";
import NoteCard from "./noteCard";
import { range } from "@/utils/range";
import { Notebook } from "@/types/notebook";

export default function NoteCardWrapper({notebooks}) {
    return (
        <div className="mx-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {notebooks.map((notebook:Notebook) => <NoteCard key={crypto.randomUUID()} notebook={notebook}/>)}
        </div>
    );
}