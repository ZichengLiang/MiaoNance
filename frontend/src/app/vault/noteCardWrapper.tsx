import React from "react";
import NoteCard from "./noteCard";

export default function NoteCardWrapper() {
    return (
        <div className="mx-32 grid grid-cols-4 gap-4">
            <NoteCard/>
            <NoteCard/>
            <NoteCard/>
            <NoteCard/>
            <NoteCard/>
        </div>
    );
}