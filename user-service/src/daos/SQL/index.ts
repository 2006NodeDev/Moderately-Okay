import { Pool } from 'pg';
/*
"Important: A process gets envrmnt variables when it starts 
if you make envr variable while vscode/gitbash is running, it does not get the envr variable
you have to restart  vscode/git-bash
*/

//entrypoint for all of the database files
export const connectionPool: Pool = new Pool({
    host: process.env['LB_HOST'],
    user: process.env['LB_USER'],
    password: process.env['LB_PASSWORD'],
    database: process.env['LB_DATABASE'],
    port: 5432,
    max: 5  // max number of connections 
})

