import express from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';

// config
import config from './config';

// routes
import userRouter from './routes/user-routes';
import taskRouter from './routes/task-routes';
import folderRouter from './routes/folder-routes'
import eventRouter from './routes/event-routes';

// middlewares
import currentUser from './middlewares/current-user';
import errorHandler from './middlewares/error-handler';

mongoose.Promise = global.Promise;
mongoose.connect(config.database, (err) => {
  if (err) throw err;

  console.log('mongoose connected');
});

const app = express();

app.listen(config.port, (err) => {
  if (err) throw err;

  console.log(`Listening on http://localhost:${config.port}/`);
});

app.use(express.static(join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
}));

app.use(currentUser);

app.use('/user', userRouter);
app.use('/tasks', taskRouter);
app.use('/folders', folderRouter);
app.use('/events', eventRouter);

app.get('/', (req, res) => {
  res.render(req.user ? 'app' : 'landing');
})

app.use(errorHandler);


