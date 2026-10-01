import React, { useState } from 'react';
import { Copy, Check, Download, Maximize2, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<{ url: string; alt: string } | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filter out any raw JSON artifacts like dalle.text2im or raw object dumps
  let sanitizedContent = content
    .replace(/dalle\.text2im\([^)]*\)/gi, '')
    .replace(/```(?:json)?\s*\{[\s\S]*?"(?:prompt|image_url|model)"[\s\S]*?\}\s*```/gi, '');

  // Split content by code blocks: ```lang\ncode```
  const parts = sanitizedContent.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-sm md:text-base text-slate-800">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Extract language and code
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd).trim() || 'plaintext';
          const code = part.slice(firstLineEnd + 1, -3).trim();

          // Suppress if the code block is accidentally an internal image JSON call
          if (code.includes('dalle.text2im') || (code.startsWith('{') && code.includes('"prompt"'))) {
            return null;
          }

          return (
            <div
              key={index}
              className="my-3 overflow-hidden rounded-xl border border-slate-700/80 bg-[#0f172a] shadow-md"
            >
              {/* Code block header bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#1e293b] px-4 py-2 text-xs text-slate-300">
                <span className="font-mono font-semibold uppercase tracking-wider text-sky-400">
                  {language}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(code, index)}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">បានចម្លង</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">ចម្លងកូដ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code content */}
              <pre className="overflow-x-auto p-4 text-xs sm:text-sm font-mono text-sky-200 leading-normal selection:bg-blue-600/40">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Render standard text with markdown lines (headings, lists, bold, images)
        const lines = part.split('\n');

        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();

              if (!trimmed) {
                return <div key={lIdx} className="h-1.5" />;
              }

              // Check for Markdown Image syntax: ![alt](url)
              const imgMatch = trimmed.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
              if (imgMatch) {
                const altText = imgMatch[1] || 'រូបភាពដែលបានបង្កើតដោយ SkyPro AI';
                const imgUrl = imgMatch[2];
                return (
                  <AIImageCard
                    key={lIdx}
                    url={imgUrl}
                    alt={altText}
                    onPreview={() => setPreviewImageUrl({ url: imgUrl, alt: altText })}
                  />
                );
              }

              // Check if line is a standalone Pollinations or Image URL
              if (
                /^https?:\/\/image\.pollinations\.ai\/prompt\/[^\s]+$/.test(trimmed) ||
                /^https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp)(?:\?[^\s]*)?$/i.test(trimmed)
              ) {
                return (
                  <AIImageCard
                    key={lIdx}
                    url={trimmed}
                    alt="រូបភាពដែលបានបង្កើតដោយ SkyPro AI"
                    onPreview={() => setPreviewImageUrl({ url: trimmed, alt: 'រូបភាពដែលបានបង្កើតដោយ SkyPro AI' })}
                  />
                );
              }

              // Horizontal rule
              if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
                return <hr key={lIdx} className="my-3 border-t border-slate-200" />;
              }

              // Display Math Formula block ($$...$$)
              if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) {
                const formula = trimmed.slice(2, -2).trim();
                return (
                  <div
                    key={lIdx}
                    className="my-2.5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-center font-mono text-sm sm:text-base text-blue-900 overflow-x-auto shadow-xs"
                  >
                    {formula}
                  </div>
                );
              }

              // Highlighted Final Answer / Result Card
              if (trimmed.startsWith('**ចម្លើយ') || trimmed.startsWith('**លទ្ធផល') || trimmed.startsWith('**សេចក្តីសន្និដ្ឋាន')) {
                return (
                  <div
                    key={lIdx}
                    className="my-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-xs"
                  >
                    {renderInlineFormatting(trimmed)}
                  </div>
                );
              }

              // Headings
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="text-base font-bold text-slate-900 pt-2 text-blue-700">
                    {renderInlineFormatting(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="text-lg font-bold text-slate-900 pt-3 border-b border-slate-200 pb-1">
                    {renderInlineFormatting(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lIdx} className="text-xl font-bold text-slate-900 pt-4">
                    {renderInlineFormatting(trimmed.slice(2))}
                  </h2>
                );
              }

              // Bullet points
              if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const bulletContent = trimmed.slice(2);
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span className="text-slate-800">{renderInlineFormatting(bulletContent)}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-2 py-0.5">
                    <span className="font-bold text-blue-600 font-mono text-xs mt-0.5 shrink-0">
                      {numMatch[1]}.
                    </span>
                    <span className="text-slate-800">{renderInlineFormatting(numMatch[2])}</span>
                  </div>
                );
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={lIdx}
                    className="border-l-4 border-blue-500 bg-blue-50/70 pl-3 py-1.5 my-1.5 italic text-slate-700 rounded-r"
                  >
                    {renderInlineFormatting(trimmed.slice(2))}
                  </blockquote>
                );
              }

              return (
                <p key={lIdx} className="text-slate-800 leading-relaxed">
                  {renderInlineFormatting(line)}
                </p>
              );
            })}
          </div>
        );
      })}

      {/* FULLSCREEN IMAGE PREVIEW MODAL */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-10 right-0 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageUrl.url}
              alt={previewImageUrl.alt}
              className="rounded-2xl max-w-full max-h-[80vh] object-contain shadow-2xl border border-sky-500/30"
            />
            <div className="mt-3 flex items-center justify-between w-full max-w-xl px-2">
              <span className="text-xs text-slate-300 truncate">{previewImageUrl.alt}</span>
              <button
                onClick={() => downloadImage(previewImageUrl.url, previewImageUrl.alt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition shadow-lg shadow-sky-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ទាញយករូបភាព (Download)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized AI Image Card Component
const AIImageCard: React.FC<{ url: string; alt: string; onPreview: () => void }> = ({ url, alt, onPreview }) => {
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = async () => {
    setDownloading(true);
    await downloadImage(url, alt);
    setDownloading(false);
  };

  return (
    <div className="my-4 max-w-lg rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0C1220] shadow-xl group transition-all duration-300 hover:border-sky-500/50">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-[#090E1A]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 font-sans">រូបភាព AI (SkyPro Generator)</span>
        </div>
        <span className="text-[10px] text-sky-400/80 font-mono">1024x1024 • HD</span>
      </div>

      {/* Image container */}
      <div className="relative aspect-square w-full bg-slate-900/90 overflow-hidden flex items-center justify-center">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-slate-400 animate-pulse">
            <ImageIcon className="w-8 h-8 text-sky-400/60" />
            <span className="text-xs text-sky-300/80">SkyPro កំពុងផ្ទុកទិន្នន័យរូបភាព...</span>
          </div>
        )}

        <img
          src={url}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onPreview}
        />

        {/* Hover overlay preview button */}
        {loaded && (
          <button
            onClick={onPreview}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/90 hover:text-white opacity-0 group-hover:opacity-100 transition shadow-lg"
            title="ពង្រីកមើលរូបភាព"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Footer bar with caption & Download button */}
      <div className="p-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#0A0F1D]">
        <p className="text-xs text-slate-300 line-clamp-1 italic font-sans" title={alt}>
          {alt}
        </p>

        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={downloading}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 active:scale-95 transition shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'កំពុងទាញយក...' : 'ទាញយករូបភាព'}</span>
        </button>
      </div>
    </div>
  );
};

// Helper function to download image as file
async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${(filename || 'skypro-image').replace(/[^a-zA-Z0-9_\-\u1780-\u17FF]/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (err) {
    // If CORS fails, open direct
    window.open(url, '_blank');
  }
}

// Helper to parse **bold** and `code` inline
function renderInlineFormatting(text: string): React.ReactNode {
  // Check for inline images ![alt](url) within text
  const imgParts = text.split(/(!\[[^\]]*\]\(https?:\/\/[^\s)]+\))/g);
  if (imgParts.length > 1) {
    return imgParts.map((sub, idx) => {
      const match = sub.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
      if (match) {
        return (
          <AIImageCard
            key={idx}
            url={match[2]}
            alt={match[1] || 'រូបភាព AI'}
            onPreview={() => {}}
          />
        );
      }
      return renderInlineText(sub, idx);
    });
  }

  return renderInlineText(text, 0);
}

function renderInlineText(text: string, baseKey: number): React.ReactNode {
  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((subPart, i) => {
    if (subPart.startsWith('`') && subPart.endsWith('`')) {
      return (
        <code
          key={`${baseKey}-code-${i}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-blue-700 border border-slate-200"
        >
          {subPart.slice(1, -1)}
        </code>
      );
    }

    // Split by inline math: $formula$
    const mathParts = subPart.split(/(\$[^$\n]+\$)/g);
    return mathParts.map((mPart, k) => {
      if (mPart.startsWith('$') && mPart.endsWith('$') && mPart.length > 2) {
        return (
          <span
            key={`${baseKey}-${i}-math-${k}`}
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-blue-50 text-blue-800 font-mono text-xs sm:text-sm border border-blue-200 font-medium"
          >
            {mPart.slice(1, -1)}
          </span>
        );
      }

      // Split by bold: **text**
      const boldParts = mPart.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, j) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`${baseKey}-${i}-${k}-${j}`} className="font-bold text-slate-900">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return bPart;
      });
    });
  });
}
