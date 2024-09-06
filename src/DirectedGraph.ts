/**
 * Class representing a directed graph using an adjacency list.
 */
export class DirectedGraph<T> {
    private adjacencyList: Map<T, T[]>;
    private inDegree: Map<T, number>;
    private outDegree: Map<T, number>;

    constructor() {
        this.adjacencyList = new Map();
        this.inDegree = new Map();
        this.outDegree = new Map();
    }

    
    /* Builds the graph from a list of edges.
    * @param edges - A list of edges, where each edge is a tuple of two vertices.
    * @throws Will throw an error if the edge format is invalid.
    */
    static fromEdges<T>(edges: [T, T][]): DirectedGraph<T> {
        const graph = new DirectedGraph<T>();
        edges.forEach(([vertex1, vertex2]) => {
            graph.addEdge(vertex1, vertex2);
        });
        return graph;
    }

    /**
     * Adds a vertex to the graph.
     * @param vertex - The vertex to add.
     * @throws Will throw an error if the vertex is null or undefined.
     */
    addVertex(vertex: T): void {
        if (vertex === null || vertex === undefined) {
            throw new Error('Vertex cannot be null or undefined');
        }
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
            this.inDegree.set(vertex, 0);
            this.outDegree.set(vertex, 0);
        }
    }

    /**
     * Adds a directed edge from vertex1 to vertex2.
     * @param vertex1 - The starting vertex of the edge.
     * @param vertex2 - The ending vertex of the edge.
     * @throws Will throw an error if either vertex is null or undefined.
     */
    addEdge(vertex1: T, vertex2: T): void {
        if (vertex1 === null || vertex1 === undefined || vertex2 === null || vertex2 === undefined) {
            throw new Error('Vertices cannot be null or undefined');
        }
        if (!this.adjacencyList.has(vertex1)) {
            this.addVertex(vertex1);
        }
        if (!this.adjacencyList.has(vertex2)) {
            this.addVertex(vertex2);
        }
        this.adjacencyList.get(vertex1)?.push(vertex2);
        this.inDegree.set(vertex2, (this.inDegree.get(vertex2) || 0) + 1);
        this.outDegree.set(vertex1, (this.outDegree.get(vertex1) || 0) + 1);
    }

    /**
     * Gets the neighbors of a vertex.
     * @param vertex - The vertex to get neighbors for.
     * @returns An array of neighboring vertices or undefined if the vertex does not exist.
     * @throws Will throw an error if the vertex is null or undefined.
     */
    getNeighbors(vertex: T): T[] | undefined {
        if (vertex === null || vertex === undefined) {
            throw new Error('Vertex cannot be null or undefined');
        }
        return this.adjacencyList.get(vertex);
    }

    /**
     * Gets all vertices in the graph.
     * @returns An array of all vertices.
     */
    getVertices(): IterableIterator<T> {
        return this.adjacencyList.keys();
    }

    /**
     * Finds the head vertices (sources) of the graph.
     * @returns An array of vertices with no incoming edges.
     */
    findHeads(): T[] {
        // Perform fast check for normal path
        const heads: T[] = [];
        for (let [vertex, degree] of this.inDegree) {
            if (degree === 0) {
                heads.push(vertex);
            }
        }

        if (heads.length > 0){
            return heads;
        }

        const sccs = this.findSCCs();
        if (sccs.length == 3){
            return sccs[1];
        }

        return [];
    }

    /**
     * Finds the Strongly connected connectivity.
     * @returns [cycle,heads,tails]
     */
    findSCCs(): T[][] {
        const indexMap = new Map<T, number>();
        const lowLinkMap = new Map<T, number>();
        const stack: T[] = [];
        const onStack = new Set<T>();
        const sccs: T[][] = [];
        let index = 0;

        const dfs = (vertex: T) => {
            indexMap.set(vertex, index);
            lowLinkMap.set(vertex, index);
            index++;
            stack.push(vertex);
            onStack.add(vertex);

            const neighbors = this.getNeighbors(vertex) || [];
            for (let neighbor of neighbors) {
                if (!indexMap.has(neighbor)) {
                    dfs(neighbor);
                    lowLinkMap.set(vertex, Math.min(lowLinkMap.get(vertex)!, lowLinkMap.get(neighbor)!));
                } else if (onStack.has(neighbor)) {
                    lowLinkMap.set(vertex, Math.min(lowLinkMap.get(vertex)!, indexMap.get(neighbor)!));
                }
            }

            if (lowLinkMap.get(vertex) === indexMap.get(vertex)) {
                const scc: T[] = [];
                let w: T;
                do {
                    w = stack.pop()!;
                    onStack.delete(w);
                    scc.push(w);
                } while (w !== vertex);
                sccs.push(scc);
            }
        };

        for (let vertex of this.adjacencyList.keys()) {
            if (!indexMap.has(vertex)) {
                dfs(vertex);
            }
        }

        return sccs;
    }

    /**
     * Finds the tail vertices (sinks) of the graph.
     * @returns An array of vertices with no outgoing edges.
     */
    findTails(): T[] {
        const tails: T[] = [];
        const heads = this.findHeads();

        for (let [vertex, degree] of this.outDegree) {
            if (degree === 0) {
                for (let head of heads) {
                    if (this.isReachable(head, vertex)) {
                        tails.push(vertex);
                        break;
                    }
                }
            }
        }

        return tails;
    }

    /**
     * Check if a path exists between two nodes.
     * @param source the head to begin
     * @param target the tail to reach
     * @returns True if a path exists
     */
    private isReachable(source: T, target: T): boolean {
        const visited = new Set<T>();
        const stack: T[] = [source];

        while (stack.length > 0) {
            const vertex = stack.pop()!;
            if (vertex === target) {
                return true;
            }
            if (!visited.has(vertex)) {
                visited.add(vertex);
                const neighbors = this.getNeighbors(vertex) || [];
                for (let neighbor of neighbors) {
                    stack.push(neighbor);
                }
            }
        }

        return false;
    }

    isStronglyConnected(): boolean {
        const visited = new Set<T>();
        const vertices = Array.from(this.adjacencyList.keys());

        if (vertices.length === 0) return true;

        // Step 1: Perform DFS from the first vertex
        this.dfs(vertices[0], visited);
        if (visited.size !== vertices.length) return false;

        // Step 2: Get the transpose of the graph
        const transpose = this.getTranspose();

        // Step 3: Perform DFS on the transposed graph
        const visitedTranspose = new Set<T>();
        transpose.dfs(vertices[0], visitedTranspose);

        return visitedTranspose.size === vertices.length;
    }

    private dfs(vertex: T, visited: Set<T>, stack: T[] = []): void {
        visited.add(vertex);
        const neighbors = this.adjacencyList.get(vertex) || [];
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this.dfs(neighbor, visited, stack);
            }
        }
        stack.push(vertex);
    }

    private getTranspose(): DirectedGraph<T> {
        const transpose = new DirectedGraph<T>();
        for (let [vertex, neighbors] of this.adjacencyList) {
            for (let neighbor of neighbors) {
                transpose.addEdge(neighbor, vertex);
            }
        }
        return transpose;
    }

    /**
     * Prints the graph in a readable format.
     */
    printGraph(): void {
        for (let [vertex, edges] of this.adjacencyList) {
            console.log(`${vertex} -> ${edges.join(', ')}`);
        }
    }

    /**
     * Returns a string representation of the graph.
     * @returns A string representing the graph.
     */
    toString(): string {
        let representation = '';
        for (let [vertex, edges] of this.adjacencyList) {
            representation += `${vertex} -> ${edges.join(', ')}\n`;
        }
        return representation.trim();
    }
}
