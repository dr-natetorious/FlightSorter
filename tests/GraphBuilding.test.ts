import { DirectedGraph } from '../src/DirectedGraph';

describe('GraphBuilder', () => {

    test('should build a graph from edges [[SFO, EWR]]', () => {
        const edges = [['SFO', 'EWR']] as [string,string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('SFO')).toEqual(['EWR']);
        expect(graph.getNeighbors('EWR')).toEqual([]);
        expect(graph.findHeads()).toEqual(['SFO']);
        expect(graph.findTails()).toEqual(['EWR']);
    });

    test('should build a graph from edges [[ATL, EWR], [SFO, ATL]]', () => {
        const edges = [['ATL', 'EWR'], ['SFO', 'ATL']]as [string,string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('ATL')).toEqual(['EWR']);
        expect(graph.getNeighbors('SFO')).toEqual(['ATL']);
        expect(graph.getNeighbors('EWR')).toEqual([]);
        expect(graph.findHeads()).toEqual(['SFO']);
        expect(graph.findTails()).toEqual(['EWR']);
    });

    test('should build a graph from edges [[IND, EWR], [SFO, ATL], [GSO, IND], [ATL, GSO]]', () => {
        const edges = [['IND', 'EWR'], ['SFO', 'ATL'], ['GSO', 'IND'], ['ATL', 'GSO']] as [string,string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('IND')).toEqual(['EWR']);
        expect(graph.getNeighbors('SFO')).toEqual(['ATL']);
        expect(graph.getNeighbors('GSO')).toEqual(['IND']);
        expect(graph.getNeighbors('ATL')).toEqual(['GSO']);
        expect(graph.getNeighbors('EWR')).toEqual([]);
        expect(graph.findHeads()).toEqual(['SFO']);
        expect(graph.findTails()).toEqual(['EWR']);
    });

    test('should build a graph from edges [[A, B], [B, C], [C, A], [C, D]]', () => {
        const edges = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']] as [string, string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C']);
        expect(graph.getNeighbors('C')).toEqual(['A', 'D']);
        expect(graph.getNeighbors('D')).toEqual([]);

        // There's no path to D
        expect(graph.findHeads()).toEqual([]);
        expect(graph.findTails()).toEqual([]);
    });

    test('should build a graph from edges [[A, B], [B, C], [C, E], [C, D]]', () => {
        const edges = [['A', 'B'], ['B', 'C'], ['C', 'E'], ['C', 'D']] as [string, string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C']);
        expect(graph.getNeighbors('C')).toEqual(['E', 'D']);
        expect(graph.getNeighbors('D')).toEqual([]);

        // There's no path to D
        expect(graph.findHeads()).toEqual(['A']);
        expect(graph.findTails()).toEqual(['E','D']);
    });

    test('should build a graph from edges [[A, B], [B, C], [E, F], [C, D]]', () => {
        const edges = [['A', 'B'], ['B', 'C'], ['E', 'F'], ['C', 'D']] as [string, string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C']);
        expect(graph.getNeighbors('C')).toEqual(['D']);
        expect(graph.getNeighbors('D')).toEqual([]);
        expect(graph.getNeighbors('E')).toEqual(['F']);
        expect(graph.getNeighbors('F')).toEqual([]);

        // There's no path to D
        expect(graph.findHeads()).toEqual(['A','E']);
        expect(graph.findTails()).toEqual(['F','D']);
    });
    
    test('should build a graph from edges [[A, B], [B, C], [C, D], [D, B], [C, E]]', () => {
        const edges = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'B'], ['C', 'E']] as [string, string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C']);
        expect(graph.getNeighbors('C')).toEqual(['D', 'E']);
        expect(graph.getNeighbors('D')).toEqual(['B']);
        expect(graph.getNeighbors('E')).toEqual([]);
        expect(graph.findHeads()).toEqual(['A']);
        expect(graph.findTails()).toEqual(['E']);
    });
    
    test('should build a graph from edges [[A, B], [B, C], [C, B], [B, E], [E, F]]', () => {
        const edges = [['A', 'B'], ['B', 'C'], ['C', 'B'], ['B', 'E'], ['E', 'F']] as [string, string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C', 'E']);
        expect(graph.getNeighbors('C')).toEqual(['B']);
        expect(graph.getNeighbors('E')).toEqual(['F']);
        expect(graph.getNeighbors('F')).toEqual([]);
        expect(graph.findHeads()).toEqual(['A']);
        expect(graph.findTails()).toEqual(['F']);
    });
    
    
    test('should build a graph from edges [[A, B], [B, C], [C, A], [B, D], [D, E], [E, B]]', () => {
        const edges = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['B', 'D'], ['D', 'E'], ['E', 'B']] as [string, string][];
        
        const graph = DirectedGraph.fromEdges(edges);
        expect(graph.getNeighbors('A')).toEqual(['B']);
        expect(graph.getNeighbors('B')).toEqual(['C', 'D']);
        expect(graph.getNeighbors('C')).toEqual(['A']);
        expect(graph.getNeighbors('D')).toEqual(['E']);
        expect(graph.getNeighbors('E')).toEqual(['B']);
        expect(graph.findHeads()).toEqual([]);
        expect(graph.findTails()).toEqual([]);
    });
    
});
