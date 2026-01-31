"use client";
import { useEffect, useState } from "react";

export const SafeHTMLContent = ({ html, isExpanded }: { html: string; isExpanded: boolean }) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Escuchamos el evento de altura desde el interior del iframe
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
          /* Quitamos scrolls y márgenes que puedan falsear la medida */
          html, body { 
            margin: 0; padding: 0; overflow: hidden; 
            font-family: -apple-system, system-ui, sans-serif; 
            line-height: 1.6; color: #1a2b4b;
          }
          #content-wrapper { 
            display: flow-root; 
            padding: 24px; /* Padding interno para que el contenido no pegue a los bordes */
          }
        </style>
      </head>
      <body>
        <div id="content-wrapper">${html}</div>
        <script>
          const wrapper = document.getElementById('content-wrapper');
          const sendHeight = () => {
            const h = wrapper.offsetHeight;
            window.parent.postMessage({ type: 'UPDATE_HEIGHT', height: h }, '*');
          };
          
          // Enviamos la altura inicial y observamos cambios (por si hay imágenes que cargan después)
          window.onload = sendHeight;
          new ResizeObserver(sendHeight).observe(wrapper);
          
          // Re-enviar un par de veces por seguridad en renderizados pesados
          setTimeout(sendHeight, 500);
          setTimeout(sendHeight, 2000);
        </script>
      </body>
    </html>
  `;

  if (!isExpanded) return null;

  return (
    <div 
      className="w-full transition-[height] duration-500 ease-in-out" 
      style={{ height: height ? `${height}px` : 'auto' }}
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