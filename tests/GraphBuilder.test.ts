import { GraphBuilder } from '../src/GraphBuilder';

describe('GraphBuilder', () => {
    let graphBuilder: GraphBuilder;

    beforeEach(() => {
        graphBuilder = new GraphBuilder();
    });

    test('should build a graph from edges [[SFO, EWR]]', () => {
        const edges = [['SFO', 'EWR']];
        graphBuilder.buildGraph(edges);
        const graph = graphBuilder.getGraph();
        expect(graph.getNeighbors('SFO')).toEqual(['EWR']);
        expect(graph.getNeighbors('EWR')).toEqual([]);
    });

    test('should build a graph from edges [[ATL, EWR], [SFO, ATL]]', () => {
        const edges = [['ATL', 'EWR'], ['SFO', 'ATL']];
        graphBuilder.buildGraph(edges);
        const graph = graphBuilder.getGraph();
        expect(graph.getNeighbors('ATL')).toEqual(['EWR']);
        expect(graph.getNeighbors('SFO')).toEqual(['ATL']);
        expect(graph.getNeighbors('EWR')).toEqual([]);
    });

    test('should build a graph from edges [[IND, EWR], [SFO, ATL], [GSO, IND], [ATL, GSO]]', () => {
        const edges = [['IND', 'EWR'], ['SFO', 'ATL'], ['GSO', 'IND'], ['ATL', 'GSO']];
        graphBuilder.buildGraph(edges);
        const graph = graphBuilder.getGraph();
        expect(graph.getNeighbors('IND')).toEqual(['EWR']);
        expect(graph.getNeighbors('SFO')).toEqual(['ATL']);
        expect(graph.getNeighbors('GSO')).toEqual(['IND']);
        expect(graph.getNeighbors('ATL')).toEqual(['GSO']);
        expect(graph.getNeighbors('EWR')).toEqual([]);
    });

    test('should throw an error for invalid payload', () => {
        expect(() => graphBuilder.buildGraph(null as any)).toThrow('Invalid payload');
        expect(() => graphBuilder.buildGraph(undefined as any)).toThrow('Invalid payload');
    });

    test('should throw an error for invalid edge format', () => {
        const edges = [['A', 'B'], ['A']];
        expect(() => graphBuilder.buildGraph(edges)).toThrow('Invalid edge format');
    });
});
