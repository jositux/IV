"use client";
import IframeResizer from '@iframe-resizer/react';

export const HTMLViewer = ({ html }: { html: string }) => {
  const injectedHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          }
          #inner-content { 
            padding: 24px; 
            display: flow-root; 
          }
          body { line-height: 1.6; color: #1a2b4b; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/@iframe-resizer/child@5.3.2/index.umd.js"></script>
      </head>
      <body>
        <div id="inner-content">${html}</div>
      </body>
    </html>
  `;

  return (
    <div className="w-full bg-white">
      <IframeResizer
        // Añade esta línea para solucionar el error de TypeScript
        license="GPLv3" 
        srcDoc={injectedHTML}
        checkOrigin={false}
        className="w-full border-none block transition-opacity duration-500"
        style={{ width: '1px', minWidth: '100%' }}
        scrolling={false}
        waitForLoad={true}
      />
    </div>
  );
};