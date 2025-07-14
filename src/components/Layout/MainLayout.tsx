import React from 'react';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function MainLayout({ sidebar, children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* サイドバー */}
      <aside className="w-64 border-r border-border bg-muted/40 overflow-y-auto">
        {sidebar}
      </aside>

      {/* メインコンテンツエリア */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}