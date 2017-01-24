const express = require('express');
const app = express();
const join = require('path').join;

app.use(express.static(join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(8080);