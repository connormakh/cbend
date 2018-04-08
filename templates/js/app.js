const express = require('express')
  ,   bodyParser = require('body-parser')
  ,   app = express()
  ,   router = app.Router()
  ,   routes = require('./routes/index')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.use('/api', routes)

app.listen(3000, ()=> {
  console.log('App is listening on port 3000')
})

// app.use('/api/v1/users', users);

module.exports = app;
