const fs = require('fs')
  , SequelizeAuto = require('sequelize-auto')
  , constants = require('../constants.json')




const automate = module.exports = {
  /**
   *
   * @param app
   * @param db
   */
  generate_models: (app, db) => {
    let auto = new SequelizeAuto(db.db_name, 'root', '', {
      host: 'localhost',
      dialect: 'mysql',
      directory: app.path + '/' + app.app_name + '/' + constants.models_dir ,
      port: '3306',
      additional: {
        timestamps: false
        //...
      },
    });
    return new Promise((resolve, reject) => {
      auto.run(function (err) {
        if (err)  reject(err)
        resolve(auto)
        // console.log(auto.tables); // table list
        // console.log(auto.foreignKeys); // foreign key list
      });

    })



  },

  generate_model: (table) => {


  }
}

