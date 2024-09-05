import request from 'supertest';
import express, { Request, Response } from 'express';


const app = express();
app.use(express.json());

describe('POST /calculate', () => {
    it('should return Complete with path for edges [[SFO, EWR]]', async () => {
        const response = await request(app)
            .post('/calculate')
            .send({ edges: [['SFO', 'EWR']] });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            operation: 'Complete',
            path: ['SFO', 'EWR']
        });
    });

    it('should return Complete with path for edges [[ATL, EWR], [SFO, ATL]]', async () => {
        const response = await request(app)
            .post('/calculate')
            .send({ edges: [['ATL', 'EWR'], ['SFO', 'ATL']] });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            operation: 'Complete',
            path: ['SFO', 'EWR']
        });
    });

    it('should return Complete with path for edges [[IND, EWR], [SFO, ATL], [GSO, IND], [ATL, GSO]]', async () => {
        const response = await request(app)
            .post('/calculate')
            .send({ edges: [['IND', 'EWR'], ['SFO', 'ATL'], ['GSO', 'IND'], ['ATL', 'GSO']] });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            operation: 'Complete',
            path: ['SFO', 'EWR']
        });
    });

    it('should return ClientError for invalid payload', async () => {
        const response = await request(app)
            .post('/calculate')
            .send({ edges: 'invalid' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            operation: 'ClientError',
            error: {
                message: 'Invalid Payload. Expected [[str,str],...] like: [[A, B], [D, E], [B, C]]'
            }
        });
    });

    it('should return ClientError for empty edges array', async () => {
        const response = await request(app)
            .post('/calculate')
            .send({ edges: [] });

        expect(response.status).toBe(400);
        expect(response.body.operation).toBe('ClientError');
        expect(response.body.error.message).toContain('Unexpected count of Heads');
        expect(response.body.error.debug.heads).toEqual([]);
        expect(response.body.error.debug.tails).toEqual([]);
    });

    it('should return ServerError for unexpected server error', async () => {
        const response = await request(app)
            .post('/calculate')
            .send({ edges: [['A', 'B'], ['A', null]] });

        expect(response.status).toBe(500);
        expect(response.body.operation).toBe('ServerError');
        expect(response.body.error.message).toBe('Vertices cannot be null or undefined');
    });
});
