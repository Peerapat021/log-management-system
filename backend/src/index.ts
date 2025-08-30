import express from 'express';
import bodyParser from 'body-parser';
import logsRouter from './routes/logs';
import alertsRouter from './routes/alerts';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// routes
app.use('/logs', logsRouter);
app.use('/alerts', alertsRouter);

app.get('/', (req, res) => res.send('Backend is running'));

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
