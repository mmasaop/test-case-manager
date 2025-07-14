import React from 'react';
import { Search, X } from 'lucide-react';

interface FileSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FileSearch({ searchQuery, onSearchChange }: FileSearchProps) {
  return (
    <div className="relative px-4 pb-3">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="テストケースを検索..."
          className="w-full pl-8 pr-8 py-1.5 text-sm bg-muted/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-foreground"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}