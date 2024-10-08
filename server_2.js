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

// Create a function to handle MySQL connections
const createConnection = (username, password, host, database, port) => {
    return mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
        port: port || 3306,
    });
};

// Generalized query endpoint
app.post('/api/query', (req, res) => {
    const { username, password, host, database, port, query } = req.body;

    const connection = createConnection(username, password, host, database, port);

    connection.connect((err) => {
        if (err) {
            return res.status(500).json({ message: 'Connection failed', error: err.message });
        }

        connection.query(query, (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Query failed', error: error.message });
            }

            res.status(200).json({ message: 'Query executed successfully!', results });
        });

        // Close connection after the query execution
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
