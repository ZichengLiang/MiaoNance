"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function NoteArea() {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start writing your notes here...",
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: "",
    autofocus: "end",
  });

  // Focus editor on mount
  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) {
        setFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreen]);

  const buttonClass =
    "p-2 rounded transition disabled:opacity-50 focus:outline-none";

  const ToolbarButton = ({
    action,
    icon,
    disabled,
    isActive = false,
  }: {
    action: () => void;
    icon: React.ReactNode;
    disabled?: boolean;
    isActive?: boolean;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent editor blur
        action();
      }}
      className={`${buttonClass} ${
        isActive
          ? "bg-gray-300 dark:bg-gray-700"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      disabled={disabled}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`w-full h-full ${
        fullscreen ? "fixed inset-0 z-50 bg-black px-4 py-8" : ""
      }`}
    >
      <div
        className={`w-full ${
          fullscreen ? "h-full max-w-none" : "h-full"
        } bg-white dark:bg-[#121212] rounded-lg shadow-sm flex flex-col gap-4`}
      >
        {/* Toolbar */}
        {editor && (
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 px-4 pt-4 pb-2">
            <ToolbarButton
              action={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold size={16} />}
              isActive={editor.isActive("bold")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic size={16} />}
              isActive={editor.isActive("italic")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleUnderline().run()}
              icon={<UnderlineIcon size={16} />}
              isActive={editor.isActive("underline")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleBulletList().run()}
              icon={<List size={16} />}
              isActive={editor.isActive("bulletList")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<ListOrdered size={16} />}
              isActive={editor.isActive("orderedList")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().undo().run()}
              icon={<Undo size={16} />}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              action={() => editor.chain().focus().redo().run()}
              icon={<Redo size={16} />}
              disabled={!editor.can().redo()}
            />
            <ToolbarButton
              action={() => setFullscreen(!fullscreen)}
              icon={
                fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />
              }
            />
          </div>
        )}

        {/* Editor area */}
        <div
          className="px-4 pb-4 h-[500px] overflow-y-auto overflow-x-hidden focus:outline-none text-base leading-relaxed dark:text-white"
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
