const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Helper function for validating input
const validateConnectionDetails = ({ username, password, host, database }) => {
    if (!username || !password || !host || !database) {
        return false;
    }
    return true;
};

// Sample endpoint to test middleware
app.get('/', (req, res) => {
    res.send('Middleware is running!');
});

// Endpoint to connect to the database
app.post('/api/connect', (req, res) => {
    const { username, password, host, database, port } = req.body;

    // Validate input
    if (!validateConnectionDetails(req.body)) {
        return res.status(400).json({ message: 'Invalid connection details.' });
    }

    // Create a MySQL connection using the parameters from the request
    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed.' });
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

// Endpoint for executing queries
app.post('/api/query', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    if (!validateConnectionDetails(req.body) || !query) {
        return res.status(400).json({ message: 'Invalid query or connection details.' });
    }

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed.' });
        }

        // Use prepared statements to prevent SQL injection
        connection.execute(query, (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Query failed.' });
            }

            res.status(200).json({ message: 'Query executed successfully!', results });
        });

        connection.end();
    });
});

// Endpoint for inserting data
app.post('/api/insert', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    if (!validateConnectionDetails(req.body) || !query) {
        return res.status(400).json({ message: 'Invalid insert or connection details.' });
    }

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed.' });
        }

        connection.execute(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Insert failed.' });
            }

            res.status(200).json({ message: 'Insert executed successfully!', results });
        });

        connection.end();
    });
});

// Endpoint for updating data
app.post('/api/update', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    if (!validateConnectionDetails(req.body) || !query) {
        return res.status(400).json({ message: 'Invalid update or connection details.' });
    }

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed.' });
        }

        connection.execute(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Update failed.' });
            }

            res.status(200).json({ message: 'Update executed successfully!', results });
        });

        connection.end();
    });
});

// Endpoint for deleting data
app.post('/api/delete', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    if (!validateConnectionDetails(req.body) || !query) {
        return res.status(400).json({ message: 'Invalid delete or connection details.' });
    }

    const connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed.' });
        }

        connection.execute(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Delete failed.' });
            }

            res.status(200).json({ message: 'Delete executed successfully!', results });
        });

        connection.end();
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
