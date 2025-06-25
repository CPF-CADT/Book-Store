import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
})

const PORT = process.env.PORT ||5173;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

