import * as path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './util/db';
import { config } from './util/config';
import passportLoader from './util/passport';

export default () => {
  connectDB();

  const PORT = config.port || 5001;

  const app = express();
  const server = http.createServer(app);

  app.use(cors({
    credentials: true,
  }));
  app.use(helmet());
  passportLoader(app);

  if (!config.isDev) {
    app.use(express.static(path.resolve('client/dist')));
  }

  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};
