import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MdxPreviewProps {
  content: string;
}

// カスタムコンポーネントの定義
const TestResult = ({ status }: { status: string }) => {
  const statusColors = {
    'not-executed': 'bg-gray-100 text-gray-700',
    'passed': 'bg-green-100 text-green-700',
    'failed': 'bg-red-100 text-red-700',
    'blocked': 'bg-yellow-100 text-yellow-700',
  };

  const statusLabels = {
    'not-executed': '未実行',
    'passed': '成功',
    'failed': '失敗',
    'blocked': 'ブロック',
  };

  const colorClass = statusColors[status as keyof typeof statusColors] || statusColors['not-executed'];
  const label = statusLabels[status as keyof typeof statusLabels] || '不明';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

const FormData = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted p-4 rounded-md my-4">
      <pre className="text-sm">{children}</pre>
    </div>
  );
};

const CreditCardForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-md my-4 border border-blue-200">
      <div className="text-sm font-medium text-blue-900 mb-2">クレジットカード情報</div>
      <pre className="text-sm text-blue-800">{children}</pre>
    </div>
  );
};

const PricingTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-4 border rounded-lg overflow-hidden">
      {children}
    </div>
  );
};

const Plan = ({ name, price, children, recommended }: { name: string; price: string; children: React.ReactNode; recommended?: boolean }) => {
  return (
    <div className={`p-4 ${recommended ? 'bg-primary/5 border-primary' : 'bg-background'} border-b last:border-b-0`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{name}</h4>
        <span className="text-lg font-bold">{price}</span>
      </div>
      {recommended && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">おすすめ</span>}
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
};

const BillingPreview = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-amber-50 p-4 rounded-md my-4 border border-amber-200">
      <pre className="text-sm text-amber-900">{children}</pre>
    </div>
  );
};

export function MdxPreview({ content }: MdxPreviewProps) {
  // MDXコンポーネントをマッピング
  const components = {
    TestResult,
    FormData,
    CreditCardForm,
    PricingTable,
    Plan,
    BillingPreview,
    // 標準のMarkdown要素のスタイリング
    h1: ({ children, ...props }: any) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>{children}</h3>,
    h4: ({ children, ...props }: any) => <h4 className="text-lg font-medium mt-3 mb-2" {...props}>{children}</h4>,
    p: ({ children, ...props }: any) => <p className="my-3 leading-relaxed" {...props}>{children}</p>,
    ul: ({ children, ...props }: any) => <ul className="my-3 ml-6 list-disc space-y-1" {...props}>{children}</ul>,
    ol: ({ children, ...props }: any) => <ol className="my-3 ml-6 list-decimal space-y-1" {...props}>{children}</ol>,
    li: ({ children, ...props }: any) => <li className="leading-relaxed" {...props}>{children}</li>,
    code: ({ inline, children, ...props }: any) => {
      if (inline) {
        return <code className="px-1.5 py-0.5 text-sm bg-muted rounded" {...props}>{children}</code>;
      }
      return <code {...props}>{children}</code>;
    },
    pre: ({ children, ...props }: any) => (
      <pre className="my-4 p-4 bg-muted rounded-md overflow-x-auto" {...props}>{children}</pre>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="my-4 pl-4 border-l-4 border-muted-foreground/30 italic" {...props}>{children}</blockquote>
    ),
    table: ({ children, ...props }: any) => (
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-border" {...props}>{children}</table>
      </div>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground" {...props}>{children}</th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-2 text-sm" {...props}>{children}</td>
    ),
    hr: (props: any) => <hr className="my-6 border-t border-border" {...props} />,
    a: ({ children, ...props }: any) => (
      <a className="text-primary hover:underline" {...props}>{children}</a>
    ),
    img: ({ alt, ...props }: any) => (
      <img className="my-4 rounded-md max-w-full h-auto" alt={alt} {...props} />
    ),
  };

  // カスタムタグを処理するためのプリプロセッサ
  const preprocessContent = (content: string) => {
    // 自己閉じタグを処理
    content = content.replace(/<TestResult\s+status="([^"]+)"\s*\/>/g, (_match, status) => {
      return `<TestResult status="${status}"></TestResult>`;
    });
    
    return content;
  };

  const processedContent = preprocessContent(content);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}