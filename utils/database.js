const mysql = require('mysql2')

const db = module.exports = {


    /**
     * @method initializes sql connection to db, creates db, and populates it with schema
     * @returns {Promise.<void>}
     */
    initialize: async(db, tables, associations) => {
        const con = mysql.createConnection({
            host: process.env.host,
            user: process.env.db_user,
            password: process.env.db_password
        });
        await con.connect()
        await con.query(`CREATE DATABASE ${db.db_name}`)
        await con.query(db.generate_sql(tables, associations))
    },

    /**
     * @method generates SQL for schema creation
     * @returns {Promise.<void>}
     */
    generate_sql: async(tables, associations) => {
        // console.log(json_schema)
        
    }
}