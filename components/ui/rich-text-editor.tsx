'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Type
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  className,
  minHeight = "120px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Update active formats based on cursor position
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('bulletList');
    if (document.queryCommandState('insertOrderedList')) formats.add('orderedList');
    if (document.queryCommandState('formatBlock')) {
      const blockFormat = document.queryCommandValue('formatBlock');
      if (blockFormat === 'blockquote') formats.add('blockquote');
    }
    
    setActiveFormats(formats);
  }, []);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateActiveFormats();
    }
  }, [onChange, updateActiveFormats]);

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    if (document.activeElement === editorRef.current) {
      updateActiveFormats();
    }
  }, [updateActiveFormats]);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  // Execute formatting commands
  const executeCommand = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
      }
    }
  }, [executeCommand]);

  // Handle paste to clean up formatting
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Format button component
  const FormatButton = ({ 
    command, 
    icon: Icon, 
    title, 
    value,
    isActive 
  }: { 
    command: string; 
    icon: React.ComponentType<{ className?: string }>; 
    title: string;
    value?: string;
    isActive: boolean;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-8 p-0 hover:bg-slate-100 transition-colors",
        isActive && "bg-slate-200 text-slate-900"
      )}
      onClick={() => executeCommand(command, value)}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  // Get character count (strip HTML)
  const getCharacterCount = () => {
    if (!editorRef.current) return 0;
    return editorRef.current.textContent?.length || 0;
  };

  return (
    <div className={cn("border border-slate-200 rounded-lg overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
        <FormatButton
          command="bold"
          icon={Bold}
          title="Bold (Ctrl+B)"
          isActive={activeFormats.has('bold')}
        />
        <FormatButton
          command="italic"
          icon={Italic}
          title="Italic (Ctrl+I)"
          isActive={activeFormats.has('italic')}
        />
        <FormatButton
          command="underline"
          icon={Underline}
          title="Underline (Ctrl+U)"
          isActive={activeFormats.has('underline')}
        />
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <FormatButton
          command="insertUnorderedList"
          icon={List}
          title="Bullet List"
          isActive={activeFormats.has('bulletList')}
        />
        <FormatButton
          command="insertOrderedList"
          icon={ListOrdered}
          title="Numbered List"
          isActive={activeFormats.has('orderedList')}
        />
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <FormatButton
          command="formatBlock"
          icon={Quote}
          title="Quote"
          value="blockquote"
          isActive={activeFormats.has('blockquote')}
        />
        
        <div className="flex-1" />
        
        <div className="text-xs text-slate-500 px-2">
          {getCharacterCount()}/1000
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className={cn(
            "w-full p-4 outline-none resize-none",
            "prose prose-sm max-w-none",
            "[&_strong]:font-semibold [&_em]:italic [&_u]:underline",
            "[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6",
            "[&_li]:my-1",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-4",
            "focus:ring-2 focus:ring-slate-900 focus:ring-inset",
            isFocused && "ring-2 ring-slate-900 ring-inset"
          )}
          style={{ minHeight }}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
        
        {/* Placeholder */}
        {!value && (
          <div className="absolute top-4 left-4 text-slate-400 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}