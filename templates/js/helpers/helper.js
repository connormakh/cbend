const database = require('./../utils/database')
  ,   a = require('await-to-js')


const helper = {

  /**
   *
   * @param options
   * @returns {Promise.<void>}
   */
  create: async (options) => {
    let [err, creation] = await a.to(database.create('{table_name}', options))
    if (err) throw err

    return creation
  },

  /**
   *
   * @param id
   * @returns {Promise.<void>}
   */
  get: async (id) => {
    let [err, record] = await a.to(database.find_by_id('{table_name}', id))
    if (err) throw err
    if (!record) throw new Error("No such record was found")

    return record
  },

  /**
   *
   * @param id
   * @param options
   * @returns {Promise.<void>}
   */
  update: async (id, options) => {
    let [err, update_result] = await a.to(database.update_by_id('{table_name}', id, options))
    if (err) throw err

    return update_result
  },

  /**
   *
   * @param id
   * @returns {Promise.<void>}
   */
  delete: async (id) => {
    let [err, delete_result] = await a.to(database.delete_by_id('{table_name}', id))
    if (err) throw err

    return delete_result
  }
}

module.exports = helper