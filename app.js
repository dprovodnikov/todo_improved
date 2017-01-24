import express from 'express';
import { join } from 'path';

const app = express();

app.use(express.static(join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(8080);