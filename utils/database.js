const mysql = require('mysql2')

const database = module.exports = {


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
        await con.query(database.generate_sql(db,tables, associations))
    },

    /**
     * @method generates SQL for schema creation
     * @returns {Promise.<void>}
     */
    generate_sql: async(db,tables, associations) => {
      let sql_string = "SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;\n" +
        "SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;\n" +
        "SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';" +
        `DROP SCHEMA IF EXISTS \`${db.db_name}\` ;\n` +
        `CREATE SCHEMA IF NOT EXISTS \`${db.db_name}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin ;
         USE \`${db.db_name}\` ; \n`

      for (let table of tables) {
        let table_sql = `DROP TABLE IF EXISTS  \`${db.db_name}\`.\`${table.name}\` ;
                        CREATE TABLE IF NOT EXISTS \`${db.db_name}\`.\`${table.name}\` (
                        \`id\` INT NOT NULL AUTO_INCREMENT`
        for(let prop of table.properties) {
          table_sql += `\`${prop.property_name}\` ${prop.type} ${prop.is_nullable ? 'NULL' : 'NOT NULL'} ${prop.default ? 'DEFAULT' + prop.default : ''},`
        }
        table_sql += `PRIMARY KEY (\`id\`)`

        // check for associations -

        table_sql += `);`

      }


    }
}
