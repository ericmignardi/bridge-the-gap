const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const { Client } = require('pg');

app.use(cors());
app.use(express.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Connected To DB'))
  .catch(error => console.error('Connection Error', error));

app.post("/songs", async (req, res) => {
    const {genre, difficulty, key, tempo} = req.body;
    try {
        const result = await client.query(`SELECT * FROM songs WHERE genre = $1 AND difficulty = $2 AND key = $3 AND tempo = $4 ORDER BY id;`, [genre, difficulty, key, tempo])
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No songs found matching your criteria.",
            });
        }
        return res.status(200).json(result.rows)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "An unexpected error occurred while querying the database.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});