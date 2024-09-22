const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./db.sqlite');

// Hard-coded admin credentials
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "password" // Change this in production!
};

// Admin login endpoint
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        return res.json({ message: 'Login successful!' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

// User management endpoint
app.post('/users', (req, res) => {
    const { student_id, user_type } = req.body;
    db.run(`INSERT INTO users (student_id, user_type) VALUES (?, ?)`, [student_id, user_type], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User added successfully!', id: this.lastID });
    });
});

// Activate, suspend, reactivate user
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { action } = req.body;

    let newStatus;
    if (action === 'activate') {
        newStatus = 'active';
    } else if (action === 'suspend') {
        newStatus = 'suspended';
    } else {
        return res.status(400).json({ error: 'Invalid action' });
    }

    db.run(`UPDATE users SET status = ? WHERE id = ?`, [newStatus, userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `User ${action}d successfully!` });
    });
});

// Get access log for admin
app.get('/admin/access-log', (req, res) => {
    db.all(`SELECT * FROM access_log ORDER BY timestamp DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Log access endpoint
app.post('/log-access', (req, res) => {
    const { student_id } = req.body;

    // Check if user exists and is active
    db.get(`SELECT status FROM users WHERE student_id = ?`, [student_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (row.status === 'suspended') {
            return res.status(403).json({ message: 'User account is suspended' });
        }

        // Log access if user is active
        const timestamp = new Date().toISOString();
        db.run(`INSERT INTO access_log (student_id, timestamp) VALUES (?, ?)`, [student_id, timestamp], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Access logged successfully!' });
        });
    });
});

// Search access records endpoint
app.get('/search-access', (req, res) => {
    const { startDate, endDate, studentId } = req.query;

    const query = `
        SELECT al.student_id, al.timestamp, u.user_type, u.status
        FROM access_log al
        JOIN users u ON al.student_id = u.student_id
        WHERE (al.timestamp BETWEEN ? AND ?)
        AND (u.student_id = ? OR ? = '')
    `;
    db.all(query, [startDate, endDate, studentId, studentId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});