import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Zanskbot API!');
});

const uri = process.env.MONGODB_URI || "";

mongoose.connect(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
} as mongoose.ConnectOptions).then(() => {
  console.log("Connected to MongoDB!");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
