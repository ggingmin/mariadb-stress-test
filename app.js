require('dotenv').config()
const main = async(pool) => {

    if( !pool ) throw new Error('A pool does not exist');

    try {
        let conn = await pool.getConnection();

        let table = await conn.query("CREATE TABLE IF NOT EXISTS users (id int auto_increment primary key, username varchar(256), password varchar(256))");
        console.log(table)

        // Select all rows from example table
        let [rows, fields] = await conn.query("SELECT * FROM users");
        console.log(rows);

        // insert data
        let data = {
            username: "username",
            password: "password"
        };

        let [results] = await conn.query(
            "INSERT INTO users SET ?",
            data
        );
        let insertId = results.insertId;

        [rows, fields] = await conn.query("SELECT * FROM users");
        console.log(rows);

        [results] = await conn.query("UPDATE users SET username=? WHERE 1=1", [
            "new_username",
            "new_password",
            insertId,
        ]);

        [rows, fields] = await conn.query("SELECT * FROM users");
        console.log(rows);

        [results] = await conn.query("DELETE FROM users WHERE id=?", [
            insertId,
        ]);

        [rows, fields] = await conn.query("SELECT * FROM users");
        console.log(rows);

        await conn.release();
    } catch (error) {
        console.error(error.message);
    } finally {
        // await conn.release();
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// setInterval(() => main(), 100);

(async () => {
    const mysql = require('mysql2/promise');
    const pool = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE_NAME});

    for (let i = 0;  i< 1000; i++) {
        await main(pool);
        await sleep(100);
    }
})();
