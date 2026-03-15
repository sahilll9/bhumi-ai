
import { pool } from './src/db/connection';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing DB connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

async function test() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Success:', res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Failure:', err);
        process.exit(1);
    }
}

test();
