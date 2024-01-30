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
            result.push({
                id: uuidv4(),
                name: item.name,
                type: 'file'
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
        // console.log(node);
    }
    
}