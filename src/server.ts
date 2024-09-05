require('dotenv').config();
import express, { Request, Response } from 'express';
import { DirectedGraph } from './DirectedGraph';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const graph = new DirectedGraph<string>();

app.post('/calculate', (req: Request, res: Response)=>{
    const { edges }: { edges: string[][]} = req.body;

    if(!edges || !Array.isArray(edges)){
        return res.status(400).send('Invalid Payload. Expected [[str,str],...] like: [[A, B], [D, E], [B, C]]');
    }
    try{

    } catch (error) {
        
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
