const express = require('express')
  ,   bodyParser = require('body-parser')
  ,   app = express()
  ,   router = app.Router()
  ,   routes = require('./routes/index')
  ,   a = require('await-to-js')
  ,   database = require('./utils/database')

const api = {
  init: async () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    router.use('/api', routes)

    let [db_err, db] = await a.to(database.connect('master'))
    if (db_err) throw db_err


    app.listen(3000, ()=> {
      console.log('App is listening on port 3000')
    })
  }
}

api.init()


module.exports = app;
