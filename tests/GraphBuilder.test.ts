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
});
