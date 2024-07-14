import express from 'express';
import cors from 'cors';
import { vidRoutes } from './src/routes/vidRoutes';
import { authRoutes } from './src/routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/videos',vidRoutes())
app.use('/auth',authRoutes())

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});