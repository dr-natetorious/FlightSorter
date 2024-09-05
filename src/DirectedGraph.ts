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
        const heads: T[] = [];
        for (let [vertex, degree] of this.inDegree) {
            if (degree === 0) {
                heads.push(vertex);
            }
        }
        return heads;
    }

    /**
     * Finds the tail vertices (sinks) of the graph.
     * @returns An array of vertices with no outgoing edges.
     */
    findTails(): T[] {
        const tails: T[] = [];
        for (let [vertex, degree] of this.outDegree) {
            if (degree === 0) {
                tails.push(vertex);
            }
        }
        return tails;
    }

    /**
     * Prints the graph in a readable format.
     */
    printGraph(): void {
        for (let [vertex, edges] of this.adjacencyList) {
            console.log(`${vertex} -> ${edges.join(', ')}`);
        }
    }
}
