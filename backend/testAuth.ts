import { pool } from './src/config/db';
async function testAuth() {
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', ['tosinoke1801@gmail.com']);
    console.log("Users found:", users);
    process.exit(0);
}
testAuth();
