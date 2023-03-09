import * as path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import connectDB from './util/db';

dotenv.config();

connectDB();

const PORT = Number(process.env.PORT) || 5000;

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('client/dist')));
}

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
