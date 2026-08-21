import React from 'react';
import { Link } from 'react-router-dom';

interface ChatMarkdownProps {
  content: string;
}

export const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ content }) => {
  // Simple & clean markdown-to-React elements parser
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (keyIndex: number) => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const body = tableRows.slice(1);
        elements.push(
          <div key={`table-${keyIndex}`} className="my-2.5 overflow-x-auto border border-north-black/20 rounded">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-north-dark-sand/70 border-b border-north-black/20">
                <tr>
                  {header.map((col, ci) => (
                    <th key={ci} className="py-1.5 px-2.5 font-heading font-bold text-north-black">
                      {col.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-north-black/10 bg-white">
                {body.map((row, ri) => (
                  <tr key={ri} className="hover:bg-north-bg/50 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-1.5 px-2.5 text-north-black/90 font-mono text-[11px]">
                        {formatInline(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table row detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator line |:---|:---|
        if (trimmed.includes('---')) {
          return;
        }
        inTable = true;
        const cols = trimmed.slice(1, -1).split('|');
        tableRows.push(cols);
        return;
      } else if (inTable) {
        flushTable(index);
      }

      // Empty line
      if (!trimmed) {
        elements.push(<div key={index} className="h-1.5" />);
        return;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="font-heading font-extrabold text-sm text-north-black mt-2 mb-1">
            {formatInline(trimmed.replace('### ', ''))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="font-heading font-bold text-xs uppercase tracking-wide text-north-black mt-2 mb-1">
            {formatInline(trimmed.replace('#### ', ''))}
          </h4>
        );
        return;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote
            key={index}
            className="border-l-2 border-north-lime-dark bg-north-dark-sand/30 pl-2.5 py-1 text-xs italic text-north-black my-1.5 rounded-r"
          >
            {formatInline(trimmed.replace('> ', ''))}
          </blockquote>
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-0.5 text-xs text-north-black/90 pl-1">
            <span className="text-north-lime-dark font-bold">•</span>
            <div className="flex-1">{formatInline(trimmed.substring(2))}</div>
          </div>
        );
        return;
      }

      // Numbered list
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 text-xs text-north-black/90 pl-1">
            <span className="font-mono font-bold text-[11px] text-north-black bg-north-dark-sand px-1.5 py-0.2 rounded shrink-0">
              {numMatch[1]}
            </span>
            <div className="flex-1">{formatInline(numMatch[2])}</div>
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={index} className="text-xs leading-relaxed text-north-black/90 my-1 font-body">
          {formatInline(trimmed)}
        </p>
      );
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  // Inline formatting for **bold**, `code`, and [link](url)
  const formatInline = (text: string): React.ReactNode => {
    // Match markdown links [text](url)
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g);

    return parts.map((part, i) => {
      // Link [label](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const label = linkMatch[1];
        const url = linkMatch[2];
        const isInternal = url.startsWith('/');
        if (isInternal) {
          return (
            <Link
              key={i}
              to={url}
              className="text-north-black font-semibold underline decoration-north-lime decoration-2 underline-offset-2 hover:bg-north-lime hover:text-black px-0.5 rounded transition-all"
            >
              {label}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-north-black font-semibold underline decoration-north-lime decoration-2 underline-offset-2 hover:bg-north-lime px-0.5 rounded transition-all"
          >
            {label}
          </a>
        );
      }

      // Code `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={i}
            className="font-mono text-[11px] bg-north-dark-sand/80 text-north-black px-1.5 py-0.5 rounded border border-north-black/10 mx-0.5 font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold **bold**
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={i} className="font-bold text-north-black">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  return <div className="chat-markdown-content">{renderFormattedText(content)}</div>;
};
