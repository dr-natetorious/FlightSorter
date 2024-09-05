/**
 * Class representing a directed graph using an adjacency list.
 */
export class DirectedGraph<T> {
    private adjacencyList: Map<T, T[]>;

    constructor() {
        this.adjacencyList = new Map();
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
     * Prints the graph in a readable format.
     */
    printGraph(): void {
        for (let [vertex, edges] of this.adjacencyList) {
            console.log(`${vertex} -> ${edges.join(', ')}`);
        }
    }
}
