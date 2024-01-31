import express, { Express, Request, Response , Application } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import fs from 'fs'
import path from 'path';
import parser from 'csv-parse';
import { handleCSVFile, handleJSONFile, handleLogFile, readFileDirectory, replaceUuids } from './helper';
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

app.post('/api/v1/read_file', (req: Request, res: Response) => {
    const filePath = req.body.fileUrl
    const ext = path.extname(filePath as string);
    switch(ext) {
        case '.csv':
            handleCSVFile(filePath, res);
            break;
        case '.json':
            handleJSONFile(filePath, res);
            break;
        case '.log':
            handleLogFile(filePath, res);
            break;
        default:
            res.status(500).send('File type not supported');
    }
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