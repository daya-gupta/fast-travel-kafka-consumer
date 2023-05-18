import express from 'express';
import dotenv from 'dotenv';

dotenv.config({
    path: 'env/.env.dev'
});

const PORT = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
    res.send('kafka consumer is working!!');
});

app.listen(PORT, () => {
    console.log(`Kafka consumer started on port ${PORT}`)
});
