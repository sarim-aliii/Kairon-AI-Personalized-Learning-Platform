import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  // Custom Copy Button Component for Code Blocks
  const CopyButton = ({ text }: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy Code"
      >
        {isCopied ? (
          <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Copied!
          </span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    // FIX: Applied className to wrapper div instead of ReactMarkdown to prevent crash
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
        <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
            // Override the 'code' element to handle code blocks vs inline code
            code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');

            return !inline && match ? (
                <div className="relative group my-6 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                {/* Header Bar for Code Block */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400 lowercase">
                    {match[1]}
                    </span>
                </div>
                
                {/* The Code Highlighter */}
                <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    backgroundColor: '#0f172a', // Matches bg-slate-900
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    }}
                >
                    {codeText}
                </SyntaxHighlighter>

                {/* Copy Button (Appears on Hover) */}
                <CopyButton text={codeText} />
                </div>
            ) : (
                // Inline Code Styling (e.g. `variableName`)
                <code {...props} className="bg-slate-200 dark:bg-slate-800 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded font-mono text-sm font-semibold">
                {children}
                </code>
            );
            },
            // Styling standard elements to look professional
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-2 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="text-slate-600 dark:text-slate-400" {...props} />,
            p: ({node, ...props}) => <p className="leading-relaxed mb-4" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
        }}
        >
        {content}
        </ReactMarkdown>
    </div>
  );
};