const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Sample endpoint to test middleware
app.get('/', (req, res) => {
    res.send('Middleware is running!');
});

// Endpoint to connect to the database
app.post('/api/connect', (req, res) => {
    const { username, password, host, database, port } = req.body;

    // Create a MySQL connection using the parameters from the request
    const connection = mysql.createConnection({
        host: host, // Use host from the request body
        user: username, // Use username from the request body
        password: password, // Use password from the request body
        database: database, // Use database from the request body
        port: port || 3306, // Use provided port or default to 3306
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }
        res.status(200).json({ message: 'Connected successfully!' });

        // End the connection after a successful connection to avoid hanging
        connection.end((endErr) => {
            if (endErr) {
                console.error('Error ending the connection:', endErr.message);
            }
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.post('/api/query', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }

        connection.query(query, (error, results) => {
            // Handle query error
            if (error) {
                return res.status(500).json({ message: 'Query failed', error: error.message });
            }

            res.status(200).json({ message: 'Query executed successfully!', results });
        });

        connection.end(); // Close connection
    });
});


app.post('/api/insert', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }

        connection.query(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Insert failed', error: error.message });
            }

            res.status(200).json({ message: 'Insert executed successfully!', results });
        });

        connection.end(); // Close connection
    });
});


app.post('/api/update', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }

        connection.query(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Update failed', error: error.message });
            }

            res.status(200).json({ message: 'Update executed successfully!', results });
        });

        connection.end(); // Close connection
    });
});


app.post('/api/delete', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }

        connection.query(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Delete failed', error: error.message });
            }

            res.status(200).json({ message: 'Delete executed successfully!', results });
        });

        connection.end(); // Close connection
    });
});
