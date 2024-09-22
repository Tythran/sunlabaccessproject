const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
    // Create access_log table
    db.run(`CREATE TABLE IF NOT EXISTS access_log (
        id INTEGER PRIMARY KEY,
        student_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        student_id TEXT NOT NULL UNIQUE,
        user_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active'
    )`);
});

db.close();