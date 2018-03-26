
const database = module.exports = {


  /**
   * @method initializes sql connection to db, creates db, and populates it with schema
   * @returns {Promise.<void>}
   */
  initialize: async (db, tables) => {
    const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    await con.connect()
    await con.query(`CREATE DATABASE ${db.db_name};`)
    con.query(database.generate_sql(db, tables), (err, result) => {
      console.log(err)
      console.log(result)
    })
  },


  /**
   * @method generates SQL for schema creation
   * @returns {Promise.<void>}
   */
  generate_sql: (db, tables) => {
    let sql_string =
      "SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;" +
      "SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; SET FOREIGN_KEY_CHECKS=0;" +
      "SET @OLD_SQL_MODE=@@SQL_MODE; SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';" +
      `DROP SCHEMA IF EXISTS \`${db.db_name}\` ; CREATE SCHEMA IF NOT EXISTS \`${db.db_name}\`; USE \`${db.db_name}\` ;`

    for (let table of tables) {
      let table_sql = `DROP TABLE IF EXISTS  \`${db.db_name}\`.\`${table.name}\` ;
                        CREATE TABLE IF NOT EXISTS \`${db.db_name}\`.\`${table.name}\` (
                        \`id\` INT NOT NULL AUTO_INCREMENT, `
      for (let prop of table.properties) {
        table_sql += `\`${prop.property_name}\` ${prop.type + (prop.size ? '(' + prop.size + ')' : '')} ${prop.is_nullable ? 'NULL' : 'NOT NULL'} ${prop.default ? 'DEFAULT ' + "'" + prop.default + "'" : ''},`
      }
      table_sql += `PRIMARY KEY (\`id\`)`

      // check for associations -
      if (table.associations && table.associations.length) {
        table_sql += ', '
        // properties
        for (let ass of table.associations) {
          table_sql += `\`${ass.name}_id\` INT ${ass.is_nullable ? 'NULL' : 'NOT NULL'},`
        }

        // indices
        for (let ass of table.associations) {
          table_sql += `INDEX \`${table.name}_${ass.name}_id_idx\` (\`${ass.name}_id\` ASC),`
        }

        // constraints
        for (let ass of table.associations) {
          table_sql += `CONSTRAINT \`${table.name}_${ass.name}_id\`
                            FOREIGN KEY (\`${ass.name}_id\`)
                            REFERENCES \`${db.db_name}\`.\`${ass.name}\` (\`id\`)
                            ON DELETE NO ACTION
                            ON UPDATE NO ACTION,`
        }
        table_sql = table_sql.slice(0, -1) // remove last trailing comma
      }

      table_sql += `);`
      sql_string += table_sql
    }

    return sql_string


  }
}
