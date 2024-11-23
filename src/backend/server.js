const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql'); // Ensure you have installed mssql package

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQL Server Configuration
const sqlConfig = {
    connectionString: process.env.SQL_CONNECTION_STRING,
    options: {
        encrypt: true, // For Azure SQL
        trustServerCertificate: false,
    },
};

// Connect to Azure SQL
sql.connect(sqlConfig)
    .then(pool => {
        if (pool.connecting) {
            console.log('Connecting to SQL Server...');
        }
        if (pool.connected) {
            console.log('Connected to SQL Server');
        }
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed!', err);
    });

// API endpoint to handle booking
app.post('/api/book', async (req, res) => {
    const { name, email, date, time } = req.body;

    if (!name || !email || !date || !time) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Email', sql.NVarChar, email)
            .input('Date', sql.Date, date)
            .input('Time', sql.Time, time)
            .query('INSERT INTO Bookings (Name, Email, Date, Time) VALUES (@Name, @Email, @Date, @Time)');

        res.status(201).json({ message: 'Booking confirmed!' });
    } catch (error) {
        console.error('Error inserting booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
