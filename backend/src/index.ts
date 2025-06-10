import express from 'express';
import cors from 'cors';
import apiRouter from '../routes/api';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});