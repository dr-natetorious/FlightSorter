require('dotenv').config();
import express, { Request, Response } from 'express';
import { DirectedGraph } from './DirectedGraph';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/calculate', (req: Request, res: Response)=>{
    const { edges }: { edges: [string, string][]} = req.body;

    if(!edges || !Array.isArray(edges)){
        return res.status(400).send('Invalid Payload. Expected [[str,str],...] like: [[A, B], [D, E], [B, C]]');
    }
    try{
        const graph = DirectedGraph.fromEdges(edges);
        const heads = graph.findHeads();
        const tails = graph.findTails();

        if (heads.length === 1 && tails.length === 1){
            return res.json({
                operation: 'Complete',
                path: [heads[0], tails[0]]
            });
        }

        return res.json({
            operation: 'Error',
            error:{
                message: `Unexpected count of Heads (${heads.length} != 1) or Tails (${tails.length} != 1)`,
                debug: {
                    heads,
                    tails,
                    graph: graph.toString()
                }
            }
        })

    } catch (error) {

    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
