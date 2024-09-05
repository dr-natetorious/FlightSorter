import {DirectedGraph} from '../src/DirectedGraph';

describe('DirectedGraph', () => {
    let graph: DirectedGraph<string>;

    beforeEach(() => {
        graph = new DirectedGraph<string>();
    });

    test('should add a vertex', () => {
        graph.addVertex('A');
        expect(graph.getNeighbors('A')).toEqual([]);
    });

    test('should add an edge', () => {
        graph.addVertex('A');
        graph.addVertex('B');
        graph.addEdge('A', 'B');
        expect(graph.getNeighbors('A')).toEqual(['B']);
    });

    test('should handle adding edges to non-existent vertices', () => {
        graph.addEdge('A', 'B');
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual([]);
    });

    test('should throw an error when adding a null vertex', () => {
        expect(() => graph.addVertex(null as any)).toThrow('Vertex cannot be null or undefined');
    });

    test('should throw an error when adding a null edge', () => {
        expect(() => graph.addEdge(null as any, 'B')).toThrow('Vertices cannot be null or undefined');
        expect(() => graph.addEdge('A', null as any)).toThrow('Vertices cannot be null or undefined');
    });

    test('should return undefined for non-existent vertex neighbors', () => {
        expect(graph.getNeighbors('A')).toBeUndefined();
    });
});
