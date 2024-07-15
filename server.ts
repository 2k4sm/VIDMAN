import express from 'express';
import cors from 'cors';
import { vidRoutes } from './src/routes/vidRoutes';
import { authRoutes } from './src/routes/authRoutes';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';


const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload())

app.use('/videos',vidRoutes())
app.use('/auth',authRoutes())

const outputDir = path.join(__dirname, 'out');
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(outputDir, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
});


app.get('/', (req, res) => {
    res.send({ time : new Date() ,health : "server healthy" });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


