import React from 'react';
import { 
  Bold, 
  Italic, 
  Link2, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1,
  Heading2,
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface EditorToolbarProps {
  onImageInsert?: (markdown: string) => void;
}

export function EditorToolbar({ onImageInsert }: EditorToolbarProps) {
  const tools = [
    { icon: Heading1, label: '見出し1', action: () => console.log('H1') },
    { icon: Heading2, label: '見出し2', action: () => console.log('H2') },
    { separator: true },
    { icon: Bold, label: '太字', action: () => console.log('Bold') },
    { icon: Italic, label: '斜体', action: () => console.log('Italic') },
    { separator: true },
    { icon: Link2, label: 'リンク', action: () => console.log('Link') },
    { separator: true },
    { icon: List, label: '箇条書き', action: () => console.log('List') },
    { icon: ListOrdered, label: '番号付きリスト', action: () => console.log('Ordered List') },
    { separator: true },
    { icon: Quote, label: '引用', action: () => console.log('Quote') },
    { icon: Code, label: 'コード', action: () => console.log('Code') },
  ];

  return (
    <div className="flex items-center gap-1 px-2">
      {tools.map((tool, index) => {
        if ('separator' in tool) {
          return (
            <div key={index} className="w-px h-5 bg-border mx-1" />
          );
        }

        const Icon = tool.icon;
        return (
          <button
            key={index}
            onClick={tool.action}
            className="p-1.5 hover:bg-accent hover:text-accent-foreground rounded transition-colors"
            title={tool.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
      {onImageInsert && (
        <>
          <div className="w-px h-5 bg-border mx-1" />
          <ImageUpload onImageInsert={onImageInsert} />
        </>
      )}
    </div>
  );
}