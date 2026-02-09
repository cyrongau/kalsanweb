"use client";

import React, { useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Type,
    Link as LinkIcon,
    Undo,
    Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const ToolbarButton = ({ onClick, icon: Icon, title }: any) => (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all"
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 transition-all focus-within:ring-4 focus-within:ring-primary/5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', 'h1')} title="Heading 1" />
                <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', 'h2')} title="Heading 2" />
                <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-1" />
                <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="Bold" />
                <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="Italic" />
                <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-1" />
                <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
                <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />
                <div className="w-px h-6 bg-gray-200 dark:bg-slate-800 mx-1" />
                <ToolbarButton icon={Undo} onClick={() => execCommand('undo')} title="Undo" />
                <ToolbarButton icon={Redo} onClick={() => execCommand('redo')} title="Redo" />
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                className="p-6 min-h-[300px] outline-none prose prose-slate dark:prose-invert max-w-none text-secondary dark:text-white"
                onInput={() => {
                    if (editorRef.current) {
                        onChange(editorRef.current.innerHTML);
                    }
                }}
            />
        </div>
    );
};

export default RichTextEditor;
