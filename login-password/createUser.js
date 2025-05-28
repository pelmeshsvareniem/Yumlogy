const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '20011978', // your MySQL password
    database: 'yumlogy'
});

const username = 'testuser';
const password = 'test123';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
        if (err) throw err;
        console.log('User created');
        db.end();
    });
});
