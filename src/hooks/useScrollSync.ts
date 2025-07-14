import { useRef, useCallback, useEffect } from 'react';

export function useScrollSync() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (isScrollingRef.current && isScrollingRef.current !== source) {
      return;
    }

    isScrollingRef.current = source;

    const sourceEl = source === 'editor' ? editorRef.current : previewRef.current;
    const targetEl = source === 'editor' ? previewRef.current : editorRef.current;

    if (!sourceEl || !targetEl) return;

    const sourceScrollTop = sourceEl.scrollTop;
    const sourceScrollHeight = sourceEl.scrollHeight - sourceEl.clientHeight;
    const scrollPercentage = sourceScrollHeight > 0 ? sourceScrollTop / sourceScrollHeight : 0;

    const targetScrollHeight = targetEl.scrollHeight - targetEl.clientHeight;
    targetEl.scrollTop = scrollPercentage * targetScrollHeight;

    // スクロール終了を検知
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 150);
  }, []);

  const handleEditorScroll = useCallback(() => {
    syncScroll('editor');
  }, [syncScroll]);

  const handlePreviewScroll = useCallback(() => {
    syncScroll('preview');
  }, [syncScroll]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    editorRef,
    previewRef,
    handleEditorScroll,
    handlePreviewScroll,
  };
}