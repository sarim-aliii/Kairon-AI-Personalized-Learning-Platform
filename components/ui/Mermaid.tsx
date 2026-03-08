import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import * as d3 from 'd3';

interface MermaidProps {
  chart: string;
  theme?: 'dark' | 'default' | 'forest' | 'neutral';
}

// Initial configuration
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  fontFamily: 'Rajdhani, sans-serif',
});

const sanitizeMermaidCode = (code: string): string => {
  let clean = code
    .replace(/```mermaid/g, '')
    .replace(/```/g, '')
    .replace(/^mermaid\s*/i, '')
    .replace(/--">/g, '-->')
    .replace(/-">/g, '->')
    .replace(
      /(\w+)\s*([\[\{\(])\s*(?!")([^"\n]*?[\[\]\(\)\{\}][^"\n]*?)\s*([\]\}\)])/g,
      (match, id, open, content, close) => {
        if (content.includes('"')) return match; 
        return `${id}${open}"${content}"${close}`;
      }
    )
    .replace(/\("([^"]+);/g, '("$1")')
    .replace(/"\)\)/g, '")')
    .replace(/";/g, '"')
    .trim();

  return clean;
};

export const Mermaid: React.FC<MermaidProps> = ({ chart, theme = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for D3 Zoom
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
  const svgSelectionRef = useRef<any>(null);

  // Handle Fullscreen toggle
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Render Diagram
  useEffect(() => {
    let isMounted = true;

    if (containerRef.current && chart) {
      setError(false);
      
      const cleanChart = sanitizeMermaidCode(chart);
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        flowchart: { htmlLabels: true, curve: 'basis' }
      });

      containerRef.current.innerHTML = '';

      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(id, cleanChart);

          if (isMounted && containerRef.current) {
            containerRef.current.innerHTML = svg;

            const svgElement = containerRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = 'none';
              svgElement.style.width = '100%';
              svgElement.style.height = '100%';
              svgElement.setAttribute('height', '100%');
              svgElement.setAttribute('width', '100%');

              const d3Svg = d3.select(svgElement) as any;
              svgSelectionRef.current = d3Svg;

              const zoom = d3.zoom()
                .scaleExtent([0.1, 5])
                .on('zoom', (event) => {
                  d3Svg.select('g').attr('transform', event.transform);
                });

              zoomBehaviorRef.current = zoom;
              d3Svg.call(zoom);
            }
          }
        } catch (e) {
          if (isMounted) {
            console.error("Mermaid render exception:", e);
            setError(true);
          }
        }
      };

      renderDiagram();
    }

    return () => {
      isMounted = false;
    };
  }, [chart, theme]);

  const handleZoom = (scaleFactor: number) => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, scaleFactor);
    }
  };

  const handleReset = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current.transition().duration(300).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `flowchart-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-red-400 text-sm p-4 border border-red-500/30 rounded bg-red-900/10">
        <p className="font-bold mb-2">Failed to render flowchart</p>
        <p className="text-xs text-slate-500 text-center max-w-xs mb-2">
          The AI generated invalid syntax. Please try generating again.
        </p>
        <pre className="text-[10px] text-slate-600 mt-2 p-2 bg-slate-950 rounded max-w-full overflow-hidden truncate">
            {chart.substring(0, 100)}...
        </pre>
      </div>
    );
  }

  const bgClass = theme === 'dark' ? 'bg-slate-950' : 'bg-white';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-[500px] border ${borderClass} rounded-md ${bgClass} overflow-hidden group transition-all duration-300 ${isFullscreen ? 'flex items-center justify-center h-screen' : ''}`}
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-move touch-none"
      />
      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button onClick={toggleFullscreen} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded shadow-lg border border-slate-600" title="Toggle Fullscreen">
           {isFullscreen ? <span className="text-xs">Exit</span> : <span className="text-xs">Full</span>}
        </button>
        <button onClick={() => handleZoom(1.2)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded shadow-lg border border-slate-600" title="Zoom In">+</button>
        <button onClick={() => handleZoom(0.8)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded shadow-lg border border-slate-600" title="Zoom Out">-</button>
        <button onClick={handleReset} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded shadow-lg border border-slate-600" title="Reset View">R</button>
        <button onClick={handleDownload} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded shadow-lg border border-slate-600" title="Download SVG">⇩</button>
      </div>
    </div>
  );
};