import express, { Response } from 'express';
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import { tableMappings } from './mappings';
import { fetchUuidNameMappings, getName } from './db';

export function readFileDirectory(dir: string) {
    const result: any = []
    const items = fs.readdirSync(dir, { withFileTypes: true })
    const currentDir = dir.split('/').pop() ?? '';
    const table = tableMappings.hasOwnProperty(currentDir) ? tableMappings[currentDir] : '';
    items.forEach(item => {
        if (item.isDirectory()) {
            result.push({
                id: uuidv4(),
                name: item.name,
                type: 'folder',
                children: readFileDirectory(path.join(dir, item.name))
            })
        } else {
            const filePath = path.join(dir, item.name);
            result.push({
                id: uuidv4(),
                name: item.name,
                type: 'file',
                path: filePath,
            })
        }
    });
    return result;
}

export function replaceUuids(node: any, uuidNameMappings: { [key: string]: string }) {
    if (uuidNameMappings[node.name]) {
        node.name = uuidNameMappings[node.name];
    }
    if (node.children) {
        for (const child of node.children) {
            replaceUuids(child, uuidNameMappings);
        }
    }
}


export const handleCSVFile = (filePath: any, res: Response) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading CSV file');
        }
        const lines = data.split('\n');
        const startIndex = lines.findIndex((line) => line.includes('PROG_START'));
        const csvData = startIndex !== -1 ? lines.slice(startIndex+1).join('\n') : data;
        res.type('text/csv').send(csvData);
    });
};
  
export const handleJSONFile = (filePath: any, res: Response) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading JSON file');
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            res.status(500).send('Error parsing JSON file');
        }
    });
};
  
export const handleLogFile = (filePath: any, res: Response) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading log file');
        }
        res.type('text/plain').send(data);
    });
};