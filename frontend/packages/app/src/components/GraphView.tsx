import { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Loader2 } from 'lucide-react';

export interface Node {
    id: string;
    label: string;
    type: string;
    properties: Record<string, any>;
    val?: number;
    color?: string;
    x?: number;
    y?: number;
}

interface Edge {
    source: string | Node;
    target: string | Node;
    label: string;
}

interface GraphData {
    nodes: Node[];
    links: Edge[];
}

interface GraphViewProps {
    onNodeClick?: (node: Node) => void;
}

export function GraphView({ onNodeClick }: GraphViewProps) {
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const response = await fetch('/api/graph/data');
                if (response.ok) {
                    const { nodes, edges } = await response.json();
                    setData({ nodes, links: edges });
                }
            } catch (error) {
                console.error("Failed to fetch graph data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGraph();
    }, []);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        // Initial update
        updateDimensions();

        // Wait for layout
        setTimeout(updateDimensions, 100);

        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full border rounded-lg bg-background shadow-sm overflow-hidden relative">
            {data.nodes.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground">
                    No graph data available. Ingest some files to see relationships.
                 </div>
            ) : (
                <ForceGraph2D
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={data}
                    nodeLabel="label"
                    nodeAutoColorBy="type"
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    backgroundColor="#ffffff"
                    onNodeClick={onNodeClick}
                />
            )}
        </div>
    );
}
