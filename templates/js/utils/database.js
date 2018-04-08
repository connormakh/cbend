const Sequelize = require('sequelize')
  , logger = require('./logger')
  , a = require('await-to-js')

let models_path = './../models/'
  , models = null
  , connection = null

const database = {

  get_settings: (type) => {

    return {
      name: process.env.DATABASE_MASTER_DATABASE,
      user: process.env.DATABASE_MASTER_USERNAME,
      password: process.env.DATABASE_MASTER_PASSWORD,
      host: process.env.DATABASE_MASTER_HOST,
      port: process.env.DATABASE_MASTER_PORT,
      dialect: process.env.DATABASE_DIALECT
    };
  },

  get_models: () => {
    return models
    // return associations.refresh()
  },

  get_model: (name) => {
    if (models[name]) return models[name]
    else throw new Error("Model not found")
  },

  connect: async (type) => {
    const settings = database.get_settings(type)
    connection = new Sequelize(settings.name, settings.user, settings.password, {
      host: settings.host,
      port: settings.port,
      dialect: settings.dialect,
      operatorsAliases: Sequelize.Op,
      define: {timestamps: false}
      //TODO false for unit testing
      //TODO  removes the RESULT 1+1 log from the console
    });
    let [err, connec] = await a.to(connection.authenticate())
    if (err) {
      logger.error('Error in the authentication', err);
      throw err
    }
    if (!models) {
      models = require('sequelize-auto-import')(connection, models_path);
      models = associations.refresh()
    }

    return connection
  },

  close_connection: (connection) => {
    connection.connectionManager.close();
  },

  find_by_id: async (model_name, id) => {
    // connect
    // await database.connect('slave')
    // Load model
    let model = models[model_name];
    // Query
    let [err, result] = await a.to(model.findById(id))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the findById function', [model_name, id]);
      throw err
    }
    return result
  },

  raw: async(query, options) => {
    let [err, result] = await a.to(connection.query(query, options))
    if (err) {
      logger.error('Error in the raw function', [query]);
      throw err
    }
    return result
  },

  find_one: async (model_name, attributes) => {
    // await database.connect('slave')
    // return new Promise((resolve, reject) => {
    let model = models[model_name];

    let [err, result] = await a.to(model.findOne(attributes))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the findOne query', [model_name, attributes, err]);
      throw err
    }

    return result
  },

  /**
   * @method wrapper function for sequelize's model.sum
   *
   * @param {string} model_name: name of model to be search
   * @param {string} sum_attr: attribute on which sum should be retrieved
   * @param {object} attributes: query attributes
   * @return {Promise<*>}
   */
  sum: async (model_name, sum_attr, attributes) => {
    // model
    let model = models[model_name]
    // Query
    let [sum_err, sum] = await a.to(model.sum(sum_attr, attributes))
    if (sum_err) {
      logger.error('Error in the findAll query', [model_name, sum_attr, attributes, sum_err]);
      throw sum_err
    }
    return sum
  },

  find_all: async (model_name, attributes) => {
    // await database.connect('slave')
    // Load model
    let model = models[model_name];
    let [err, result] = await a.to(model.findAll(attributes))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the findAll query', [model_name, attributes, err])
      throw err
    }
    return result
  },

  update_by_id: async (model_name, id, values) => {
    // await database.connect('master')
    // Load model
    let model = models[model_name]
    // Query
    let [err, result] = await a.to(model.update(values, {where: {id: id}}))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the update query', [model_name, id, values, err]);
      throw err
    }
    return result
  },

  update: async (model_name, attributes, values) => {
    // await database.connect('master')
    // Load model
    let model = models[model_name];
    // Query
    let [err, result] = await a.to(model.update(values, attributes))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the update query', [model_name, attributes, values, err]);
      throw err
    }
    return result
  },
  delete_by_id: async (model_name, id) => {
    // await database.connect('master')
    // Load model
    let model = models[model_name];
    // Query
    let [err, result] = await a.to(model.update({'is_deleted': 1}, {where: {id: id}}))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the delete query', [model_name, id, err]);
      throw err
    }
    return result
  },

  delete: async (model_name, attributes) => {
    // await database.connect('master')
    // Load model
    let model = models[model_name];
    // Query
    let [err, result] = await a.to(model.update({'is_deleted': 1}, attributes))
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the delete query', [model_name, attributes, err]);
      throw err
    }
    return result
  },

  insert: async (model_name, values) => {
    // await database.connect('master')
    // Load model
    let model = models[model_name];
    // Query
    let [err, result] = await a.to(model.build(values).save())
    // database.close_connection(connection)
    if (err) {
      logger.error('Error in the insert query', [model_name, values, err]);
      throw err
    }
    return result
  },

  create: async (model_name, values, options) => {
    // await database.connect('master')

    // Load model
    let model = models[model_name];
    // Query
    let [err, result] = await a.to(model.create(values, options))
    // database.close_connection(connection)

    if (err) {
      logger.error('Error in the insert query', [model_name, values, err]);
      throw err
    }
    return result
  },


  /**
   * This function inserts multiple records into a table at once.
   *
   * @param {string} model_name: Name of model
   * @param {array} values : Array of JSON objects to be inserted in bulk
   * @returns {Promise<any>}
   */
  bulk_insert: async (model_name, values) => {
    // await database.connect('master')

    // Load model
    let model = models[model_name];
    // Bulk Query
    let [bulkErr, result] = await a.to(model.bulkCreate(values))
    // database.close_connection(connection)

    if (bulkErr) {
      logger.error('Error in the insert query', [model_name, values, bulkErr]);
      throw new Error('Error in the insert query')
    }
    return result
  },

}


const associations = {

  refresh: () => {
    {associations}
    // module.exports.models = models
    return models
  }

}


module.exports = database;
