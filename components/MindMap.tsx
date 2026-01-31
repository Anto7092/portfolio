
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';
import { geminiService } from '../services/geminiService';

const MindMap: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const generateMap = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const data = await geminiService.generateMindMap(topic);
      setMindMapData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!mindMapData || !svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height] as any)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const tree = d3.tree<MindMapNode>().size([2 * Math.PI, Math.min(width, height) / 2 - 100]);
    const root = d3.hierarchy(mindMapData);
    tree(root);

    // Links
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('d', d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y) as any);

    // Nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

    node.append('circle')
      .attr('fill', d => d.children ? '#6366f1' : '#f8fafc')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 1.5)
      .attr('r', d => d.depth === 0 ? 8 : 4);

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < Math.PI ? 10 : -10)
      .attr('text-anchor', d => d.x < Math.PI ? 'start' : 'end')
      .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
      .attr('font-size', d => d.depth === 0 ? '16px' : '10px')
      .attr('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
      .attr('fill', '#1e293b')
      .text(d => d.data.label)
      .clone(true).lower()
      .attr('stroke', 'white')
      .attr('stroke-width', 3);

  }, [mindMapData]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Mind Map Generator</h3>
        <p className="text-xs text-slate-500 mb-4">Break down complex subjects into visual hierarchies.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Main Subject (e.g., Cellular Biology)"
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
          />
          <button
            onClick={generateMap}
            disabled={isGenerating || !topic.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold text-sm"
          >
            {isGenerating ? 'Mapping...' : 'Generate Map'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 overflow-hidden flex flex-col items-center justify-center min-h-[550px] relative">
        {mindMapData ? (
          <div className="w-full h-full animate-in fade-in zoom-in duration-700">
            <svg ref={svgRef} className="w-full h-full"></svg>
            <button 
              onClick={() => setMindMapData(null)}
              className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
            >
              Reset Map
            </button>
          </div>
        ) : (
          <div className="text-center py-20 px-10">
            <div className="text-6xl mb-4 opacity-30 grayscale">🌍</div>
            <h3 className="text-lg font-bold text-slate-400">Your map will appear here</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Visualizing information helps retention. Enter a topic above to create a custom branch-style mind map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMap;
