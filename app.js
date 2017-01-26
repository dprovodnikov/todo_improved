import express from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';

import config from './config';

import userRouter from './routes/user-routes';
import taskRouter from './routes/task-routes';
import errorHandler from './middlewares/errorHandler';

mongoose.Promise = global.Promise;
mongoose.connect(config.database, (err) => {
  if(err) throw err;

  console.log('mongoose connected');
});

const app = express();

app.listen(config.port, (err) => {
  if(err) throw err;

  console.log(`Listening on http://localhost:${config.port}/`);
});

app.use(express.static(join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
}));

app.use('/user', userRouter);
app.use('/tasks', taskRouter);

app.get('/', (req, res) => res.render('index') );

app.use(errorHandler);
