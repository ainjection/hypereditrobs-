import React from 'react';
import { AbsoluteFill } from 'remotion';

export type CodeBlockProps = {
  code?: string;
  language?: string;
  fontSize?: number;
  width?: number;
  background?: string;
  showLineNumbers?: boolean;
};

const SYNTAX_COLORS: Record<string, string> = {
  keyword: '#ff7b72',
  fn: '#d2a8ff',
  string: '#a5d6ff',
  number: '#79c0ff',
  comment: '#8b949e',
  variable: '#ffa657',
  operator: '#ff7b72',
  default: '#e6edf3',
};

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'import', 'from', 'export', 'default', 'async', 'await', 'class', 'new',
  'typeof', 'instanceof', 'true', 'false', 'null', 'undefined',
  'def', 'lambda', 'pass', 'yield', 'as', 'in', 'not', 'and', 'or',
]);

type Token = { text: string; color: string };

const tokenize = (line: string): Token[] => {
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return [{ text: line, color: SYNTAX_COLORS.comment }];
  }
  const tokens: Token[] = [];
  const re = /("[^"]*"|'[^']*'|`[^`]*`|\d+\.?\d*|[A-Za-z_$][A-Za-z0-9_$]*|\s+|[^\w\s])/g;
  const matches = line.match(re) || [line];
  for (const tok of matches) {
    if (/^["'`]/.test(tok)) tokens.push({ text: tok, color: SYNTAX_COLORS.string });
    else if (/^\d/.test(tok)) tokens.push({ text: tok, color: SYNTAX_COLORS.number });
    else if (KEYWORDS.has(tok)) tokens.push({ text: tok, color: SYNTAX_COLORS.keyword });
    else if (/^[A-Za-z_$]/.test(tok)) tokens.push({ text: tok, color: SYNTAX_COLORS.default });
    else if (/^[+\-*/%=<>!&|^~?:]/.test(tok)) tokens.push({ text: tok, color: SYNTAX_COLORS.operator });
    else tokens.push({ text: tok, color: SYNTAX_COLORS.default });
  }
  return tokens;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code = "const greet = (name) => {\n  return `hello ${name}`;\n};",
  language = 'typescript',
  fontSize = 28,
  width = 1100,
  background = '#0d1117',
  showLineNumbers = true,
}) => {
  const lines = code.split('\n');
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width,
          background,
          borderRadius: 14,
          padding: '28px 32px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
          fontSize,
          lineHeight: 1.6,
          color: SYNTAX_COLORS.default,
        }}
      >
        <div style={{ marginBottom: 14, fontSize: 13, color: '#8b949e' }}>{language}</div>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex' }}>
            {showLineNumbers && (
              <span style={{ color: '#484f58', minWidth: 40, userSelect: 'none' }}>{i + 1}</span>
            )}
            <span style={{ whiteSpace: 'pre' }}>
              {tokenize(line).map((tok, j) => (
                <span key={j} style={{ color: tok.color }}>{tok.text}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
