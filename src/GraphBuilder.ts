import { DirectedGraph } from './DirectedGraph';

/**
 * Class responsible for building a directed graph from a list of edges.
 */
export class GraphBuilder {
    private graph: DirectedGraph<string>;

    constructor() {
        this.graph = new DirectedGraph<string>();
    }

    /**
     * Builds the graph from a list of edges.
     * @param edges - A list of edges, where each edge is a tuple of two vertices.
     * @throws Will throw an error if the edge format is invalid.
     */
    buildGraph(edges: string[][]): void {
        if (!edges || !Array.isArray(edges)) {
            throw new Error('Invalid payload');
        }

        edges.forEach(([vertex1, vertex2]) => {
            if (vertex1 && vertex2) {
                this.graph.addEdge(vertex1, vertex2);
            } else {
                throw new Error('Invalid edge format');
            }
        });
    }

    /**
     * Returns the built graph.
     * @returns The directed graph.
     */
    getGraph(): DirectedGraph<string> {
        return this.graph;
    }
}
