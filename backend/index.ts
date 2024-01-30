import express, { Express, Request, Response , Application } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';
import { readFileDirectory, replaceUuids } from './helper';
import { fetchUuidNameMappings, getName, fetchRevisionMappings, fetchTrialMappings } from './db';
import dotenv from 'dotenv';

const directory = path.join(__dirname, '../files')
//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.get('/api/v1/file_tree', async (req: Request, res: Response) => {
    const initialTree = readFileDirectory(directory);
    const uuidNameMappings = await fetchUuidNameMappings();
    const revisionMappings = await fetchRevisionMappings();
    const trialMappings = await fetchTrialMappings();
    for (const node of initialTree) {
        replaceUuids(node, uuidNameMappings);
        replaceUuids(node, revisionMappings);
        replaceUuids(node, trialMappings);
    }
    res.send(initialTree);
});

app.get('/api/v1/revision_mappings', async (req: Request, res: Response) => {
    const revisionMappings = await fetchRevisionMappings();
    res.send(revisionMappings);
});

app.get('/api/v1/trial_mappings', async (req: Request, res: Response) => {
    const trialMappings = await fetchTrialMappings();
    res.send(trialMappings);
});

app.post('/testdbpost', async (req: Request, res: Response) => {
    const uuid = req.body.uuid;
    const table = req.body.table;
    getName(table, uuid).then((results) => {
        res.send(results[0].name);
    }).catch((error) => {
        console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});