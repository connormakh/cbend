const database = require('./../utils/database')
  ,   a = require('await-to-js')
  ,   helper = require('./../helpers/{table_name}')


const control = module.exports = {

  /**
   *
   * @param options
   * @returns {Promise.<void>}
   */
  create: async (options) => {
    let [err, creation] = await a.to(helper.create(options))
    if (err) throw err

    return creation
  },

  /**
   *
   * @param id
   * @returns {Promise.<void>}
   */
  get: async (id) => {
    let [err, record] = await a.to(database.get(id))
    if (err) throw err

    return record
  },

  /**
   *
   * @param id
   * @param options
   * @returns {Promise.<void>}
   */
  update: async (id, options) => {
    let [err, update_result] = await a.to(database.update(id, options))
    if (err) throw err

    return update_result
  },

  /**
   *
   * @param id
   * @returns {Promise.<void>}
   */
  delete: async (id) => {
    let [err, delete_result] = await a.to(database.delete(id))
    if (err) throw err

    return delete_result
  }
}