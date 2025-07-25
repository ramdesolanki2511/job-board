import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js';
import jobRoutes from './routes/jobs.route.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use('/app/auth', authRoutes)
app.use(cors())
app.use(express.json())

app.use('/jobs', jobRoutes)

app.get('/', (req, res) => {
    res.send("Job Apply Automation API");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDB()
})