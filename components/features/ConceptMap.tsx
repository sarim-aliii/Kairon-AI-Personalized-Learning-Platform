import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
    Panel,
    ReactFlowProvider,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { generateConceptMapData, generateConceptMapForTopic } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';


// --- LAYOUT HELPER ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 50;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        
        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

// --- MAIN COMPONENT ---
const ConceptMapFlow: React.FC = () => {
    const { activeProject, llm, language, addNotification, updateProjectData, ingestedText } = useAppContext();
    
    // React Flow State
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    // Local UI State
    const [newNodeLabel, setNewNodeLabel] = useState('');
    const [topic, setTopic] = useState('');
    
    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // API Hooks
    const { execute: runGenerate, loading: isGenerating } = useApi(generateConceptMapData);
    const { execute: runExpand, loading: isExpanding } = useApi(generateConceptMapForTopic);

    // Initialize from Project Data
    useEffect(() => {
        if (activeProject?.conceptMapData) {
            const { nodes: apiNodes, links: apiLinks } = activeProject.conceptMapData;
            
            if (apiNodes && apiLinks && apiNodes.length > 0) {
                const initialNodes: Node[] = apiNodes.map((n: any) => ({
                    id: n.id,
                    data: { label: n.id },
                    position: { x: 0, y: 0 }, 
                    type: 'default',
                    style: { 
                        background: n.group === 1 ? '#eff6ff' : '#fff', 
                        border: n.group === 1 ? '1px solid #2563eb' : '1px solid #94a3b8',
                        borderRadius: '8px',
                        fontSize: '12px',
                        width: 180,
                        textAlign: 'center' as const,
                        padding: '10px'
                    }
                }));

                const initialEdges: Edge[] = apiLinks.map((l: any, i: number) => ({
                    id: `e${i}`,
                    source: typeof l.source === 'object' ? l.source.id : l.source,
                    target: typeof l.target === 'object' ? l.target.id : l.target,
                    animated: true,
                    style: { stroke: '#94a3b8' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                }));

                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                    initialNodes,
                    initialEdges
                );

                setNodes(layoutedNodes as Node[]);
                setEdges(layoutedEdges);
            }
        }
    }, [activeProject, setNodes, setEdges]);

    // Handle Fullscreen Events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!mapContainerRef.current) return;
        if (!isFullscreen) {
            mapContainerRef.current.requestFullscreen().catch(err => {
                addNotification(`Error entering fullscreen mode: ${err.message}`, 'error');
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    const saveGraph = async () => {
        if (!activeProject) return;
        
        const mapData = {
            nodes: nodes.map(n => ({ id: n.id, group: 2 })), 
            links: edges.map(e => ({ source: e.source, target: e.target, value: 1 }))
        };

        await updateProjectData(activeProject._id, { conceptMapData: mapData });
        addNotification('Mind Map saved successfully!', 'success');
    };

    const handleGenerate = async () => {
        if (!ingestedText) {
            addNotification('Please ingest text first.', 'info');
            return;
        }
        
        const data = await runGenerate(llm, ingestedText, language);
        if (data) {
            const initialNodes: Node[] = data.nodes.map((n: any) => ({
                id: n.id,
                data: { label: n.id },
                position: { x: 0, y: 0 },
                style: { width: 180, borderRadius: '8px', textAlign: 'center' as const, padding: '10px', background: '#fff', border: '1px solid #94a3b8' }
            }));
            const initialEdges: Edge[] = data.links.map((l: any, i: number) => ({
                id: `e${Date.now()}-${i}`,
                source: l.source,
                target: l.target,
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed }
            }));
            
            const layout = getLayoutedElements(initialNodes, initialEdges);
            setNodes(layout.nodes as Node[]);
            setEdges(layout.edges);
            
            await updateProjectData(activeProject?._id, { conceptMapData: data });
        }
    };

    const handleGenerateFromTopic = async () => {
        if (!topic.trim()) return;
        const data = await runExpand(llm, topic, language);
        if (data) {
             const initialNodes: Node[] = data.nodes.map((n: any) => ({
                id: n.id,
                data: { label: n.id },
                position: { x: 0, y: 0 },
                style: { width: 180, borderRadius: '8px', textAlign: 'center' as const, padding: '10px', background: '#fff', border: '1px solid #94a3b8' }
            }));
            const initialEdges: Edge[] = data.links.map((l: any, i: number) => ({
                id: `e${Date.now()}-${i}`,
                source: l.source,
                target: l.target,
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed }
            }));
            
            const layout = getLayoutedElements(initialNodes, initialEdges);
            setNodes(layout.nodes as Node[]);
            setEdges(layout.edges);
        }
    };

    const handleNodeDoubleClick = async (_: React.MouseEvent, node: Node) => {
        // Ensure node.data.label is a string
        const label = typeof node.data.label === 'string' ? node.data.label : String(node.data.label || '');
        const confirmExpand = window.confirm(`Expand concept "${label}" with AI?`);
        if (!confirmExpand) return;

        try {
            const data = await runExpand(llm, label, language);
            if (data && data.nodes.length > 0) {
                const newNodes: Node[] = data.nodes
                    .filter((n: any) => !nodes.find(exist => exist.id === n.id)) 
                    .map((n: any) => ({
                        id: n.id,
                        data: { label: n.id },
                        position: { 
                            x: node.position.x + (Math.random() - 0.5) * 200, 
                            y: node.position.y + 150 + Math.random() * 50 
                        }, 
                        style: { width: 180, borderRadius: '8px', textAlign: 'center' as const, padding: '10px', background: '#f0fdf4', border: '1px solid #16a34a' }
                    }));

                const newEdges: Edge[] = data.links.map((l: any, i: number) => ({
                    id: `e-exp-${Date.now()}-${i}`,
                    source: l.source,
                    target: l.target,
                    animated: true,
                    style: { stroke: '#86efac' }
                }));

                const connectingEdges = newNodes.map((n, i) => ({
                    id: `e-connect-${Date.now()}-${i}`,
                    source: node.id,
                    target: n.id,
                    animated: true,
                    style: { stroke: '#16a34a' }
                }));

                setNodes((nds) => [...nds, ...newNodes]);
                setEdges((eds) => [...eds, ...newEdges, ...connectingEdges]);
                
                addNotification(`Expanded "${label}" with ${newNodes.length} new nodes.`, 'success');
            }
        } catch (e) {
            addNotification('Failed to expand concept.', 'error');
        }
    };

    const handleAddManualNode = () => {
        if (!newNodeLabel.trim()) return;
        const id = newNodeLabel.trim();
        const newNode: Node = {
            id,
            data: { label: id },
            position: { x: 100, y: 100 }, 
            style: { width: 180, borderRadius: '8px', textAlign: 'center' as const, padding: '10px', background: '#fff', border: '1px solid #334155' }
        };
        setNodes((nds) => [...nds, newNode]);
        setNewNodeLabel('');
    };

    const isLoading = isGenerating || isExpanding;

    if (!ingestedText && nodes.length === 0) {
        return (
             <Card title="Concept Map">
                 <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter a topic to start a map..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                        <Button onClick={handleGenerateFromTopic} disabled={!topic.trim() || isLoading}>
                            {isExpanding ? 'Generating...' : 'Start from Topic'}
                        </Button>
                    </div>
                    <EmptyState 
                        title="Interactive Mind Map" 
                        message="Visualize connections. Ingest text or enter a topic to generate a graph. Double-click nodes to expand them with AI." 
                    />
                 </div>
             </Card>
        );
    }

    return (
        <Card title="Interactive Mind Map" className="h-[800px] flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 w-full md:w-auto">
                    {ingestedText && (
                        <Button onClick={handleGenerate} disabled={isLoading} variant="secondary" className="text-xs">
                            {isGenerating ? 'Regenerating...' : 'Reset from Text'}
                        </Button>
                    )}
                    <Button onClick={saveGraph} variant="primary" className="text-xs">
                        Save Map
                    </Button>
                </div>
                
                <div className="flex gap-2 items-center w-full md:w-auto">
                    <input 
                        type="text" 
                        value={newNodeLabel}
                        onChange={(e) => setNewNodeLabel(e.target.value)}
                        placeholder="New Concept..."
                        className="flex-1 md:w-48 px-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddManualNode()}
                    />
                    <Button onClick={handleAddManualNode} variant="secondary" className="text-xs whitespace-nowrap">
                        Add Node
                    </Button>
                </div>
            </div>

            {/* Map Container with Ref for Fullscreen */}
            <div 
                ref={mapContainerRef} 
                className="flex-1 w-full h-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 relative group"
            >
                <button 
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {/* SVG content unchanged */}
                </button>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                        <Loader />
                    </div>
                )}
                
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={handleConnect}
                    onNodeDoubleClick={handleNodeDoubleClick}
                    fitView
                    attributionPosition="bottom-right"
                >
                    <MiniMap 
                        nodeStrokeColor={(n) => (n.style?.background as string) || '#eee'}
                        nodeColor={(n) => (n.style?.background as string) || '#fff'}
                        maskColor="rgba(0, 0, 0, 0.1)"
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                    />
                    <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 fill-slate-500" />
                    <Background color="#94a3b8" gap={16} size={1} />
                    
                    <Panel position="top-left" className="bg-white/90 dark:bg-slate-800/90 p-2 rounded shadow border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                        Double-click a node to <strong>Expand with AI</strong>. Drag to reorganize.
                    </Panel>
                </ReactFlow>
            </div>
        </Card>
    );
};

export const ConceptMap = () => (
    <ReactFlowProvider>
        <ConceptMapFlow />
    </ReactFlowProvider>
);