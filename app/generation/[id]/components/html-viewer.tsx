"use client";
import { useEffect, useState } from "react";

export const HTMLViewer = ({ html }: { html: string }) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_HEIGHT') {
        setHeight(event.data.height);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const injectedHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; line-height: 1.6; color: #1a2b4b; }
          #wrapper { display: flow-root; padding: 24px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <div id="wrapper">${html}</div>
        <script>
          const wrapper = document.getElementById('wrapper');
          const sendHeight = () => {
            window.parent.postMessage({ type: 'UPDATE_HEIGHT', height: wrapper.offsetHeight }, '*');
          };
          window.onload = sendHeight;
          new ResizeObserver(sendHeight).observe(wrapper);
          // Asegurar altura en cambios tardíos
          setTimeout(sendHeight, 1000);
        </script>
      </body>
    </html>
  `;

  return (
    <div 
      style={{ height: height ? `${height}px` : 'auto' }} 
      className="w-full transition-[height] duration-500 ease-in-out bg-white"
    >
      <iframe 
        srcDoc={injectedHTML} 
        className="w-full h-full border-none block" 
        scrolling="no" 
        sandbox="allow-scripts" 
      />
    </div>
  );
};