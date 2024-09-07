require('dotenv').config();
import express, { Request, Response } from 'express';
import { DirectedGraph } from './DirectedGraph';
//import { swaggerUi, specs } from '../swagger';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI setup
try {
    const { swaggerUi, specs } = require('../swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
} catch (error) {
    console.warn(`Swagger UI not enabled because: ${error}.`);
}

/**
 * @swagger
 * /calculate:
 *   post:
 *     summary: Calculate the path
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               edges:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               edges: [['IND', 'EWR'], ['SFO', 'ATL'], ['GSO', 'IND'], ['ATL', 'GSO']]
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Client error
 *       500:
 *         description: Server error
 */
app.post('/calculate', (req: Request, res: Response) => {
    const { edges }: { edges: [string, string][] } = req.body;

    if (!edges || !Array.isArray(edges)) {
        return res.status(400).json({
            operation: 'ClientError',
            error: {
                message: 'Invalid Payload. Expected [[str,str],...] like: [[A, B], [D, E], [B, C]]'
            }
        });
    }

    try {
        const graph = DirectedGraph.fromEdges(edges);
        const heads = graph.findHeads();
        const tails = graph.findTails();

        if (heads.length === 1 && tails.length === 1) {
            return res.json({
                operation: 'Complete',
                path: [heads[0], tails[0]],
            });
        }

        return res.status(400).json({
            operation: 'ClientError',
            error: {
                message: `Unexpected count of Heads (${heads.length} != 1) or Tails (${tails.length} != 1)`,
                debug: {
                    heads,
                    tails,
                    graph: graph.toString()
                }
            }
        })

    } catch (error) {
        let message = 'An unknown error occurred';
        if (error instanceof Error) {
            message = error.message;
        }

        return res.status(500).json({
            operation: 'ServerError',
            error: {
                message
            }
        });
    }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Returns a welcome message
 */
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export default app;