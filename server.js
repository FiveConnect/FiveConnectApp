const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Create a connection pool function
const createPool = (host, user, password, database, port) => {
    return mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        port: port || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

// Sample endpoint to test middleware
app.get('/', (req, res) => {
    res.send('Middleware is running!');
});

// Endpoint to connect to the database
app.post('/api/connect', (req, res) => {
    const { username, password, host, database, port } = req.body;

    // Use the pool instead of direct connection
    const pool = createPool(host, username, password, database, port);

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }
        res.status(200).json({ message: 'Connected successfully!' });

        // Release connection back to pool
        connection.release();
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/api/list-tables', (req, res) => {
    const { username, password, host, database, port } = req.body;

    const pool = createPool(host, username, password, database, port);

    pool.query('SHOW TABLES', (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Failed to retrieve tables", error: error.message });
        }

        // Format the result to return just the table names
        const tableNames = results.map((row) => Object.values(row)[0]);
        res.json({ message: "Tables retrieved successfully", tables: tableNames });
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/api/query', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const pool = createPool(host, username, password, database, port);

    pool.query(query, (error, results) => {
        // Handle query error
        if (error) {
            return res.status(500).json({ message: 'Query failed', error: error.message });
        }

        res.status(200).json({ message: 'Query executed successfully!', results });
    });
});

app.post('/api/insert', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const pool = createPool(host, username, password, database, port);

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({ message: 'Insert failed', error: error.message });
        }

        res.status(200).json({ message: 'Insert executed successfully!', results });
    });
});

app.post('/api/update', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const pool = createPool(host, username, password, database, port);

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({ message: 'Update failed', error: error.message });
        }

        res.status(200).json({ message: 'Update executed successfully!', results });
    });
});

app.post('/api/delete', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const pool = createPool(host, username, password, database, port);

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({ message: 'Delete failed', error: error.message });
        }

        res.status(200).json({ message: 'Delete executed successfully!', results });
    });
});
