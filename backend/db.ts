import mysql, { RowDataPacket } from 'mysql2/promise';

const connection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'machina_labs',
        port: 3306
    });
}

export const fetchUuidNameMappings = async () => {
    const tables = ['customer', 'part']
    let uuidNameMappings: { [key: string]: string } = {};
    for (const table of tables) {
        const db = await connection();
        const [results, fields] = await db.query(`SELECT uuid, name FROM ${table}`);
        for (const result of results as RowDataPacket[]) {
            uuidNameMappings[result.uuid] = result.name;
        }
    }
    console.log(uuidNameMappings);
    return uuidNameMappings;
    
}

export const fetchTrialMappings = async () => {
    const db = await connection();
    const [results, fields] = await db.query(`Select r.name as trial_name, t.uuid as trial_id from part_revision r JOIN trial t ON t.part_revision_uuid = r.uuid`);
    console.log(results);
    let trialMappings: { [key: string]: string } = {};
    for (const result of results as RowDataPacket[]) {
        trialMappings[result.trial_id] = result.trial_name;
    }
    return trialMappings;
}

export const fetchRevisionMappings = async () => {
    const db = await connection();
    const [results, fields] = await db.query(`Select r.uuid as revision_uuid, r.name as revision_name from part_revision r JOIN part p ON p.uuid = r.part_uuid;`);
    let revisionMappings: { [key: string]: string } = {};
    for (const result of results as RowDataPacket[]) {
        revisionMappings[result.revision_uuid] = result.revision_name;
    }
    return revisionMappings;
}


export async function getName(table: string, uuid: string): Promise<RowDataPacket[]> {
    const db = await connection();
    const [results, fields] = await db.query(`SELECT name FROM ${table} WHERE uuid = '${uuid}'`);
    return results as RowDataPacket[];
}




