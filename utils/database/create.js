const exec = require('child_process').exec
  ,   fs = require('fs')
  ,   sqlf = require('sql-formatter')

const database = module.exports = {


  /**
   * @method initializes sql connection to db, creates db, and populates it with schema
   * @returns {Promise.<void>}
   */
  initialize: (app, db, tables) => {
    const schema_path = app.path + '/' + app.app_name + '/schema.sql'
    try {
      fs.writeFileSync(schema_path , sqlf.format(database.generate_sql(db, tables)))
      console.log('   \x1b[36mcreate\x1b[0m : ' + app.path + "/schema.sql");
    } catch (e) {
      console.log(e)
    }

    return new Promise((resolve, reject) => {
      exec("mysql -u root <"+ schema_path , (err, stdout, stderr) => {
        if (err) reject(err)
        if (stderr) reject(stderr)
        resolve(stdout)
      })
    })

    // const con = mysql.createConnection({
    //   host: 'localhost',
    //   user: 'root',
    //   password: ''
    // });
    // await con.connect()
    //
    // await con.query(`CREATE DATABASE ${db.db_name};`)
    // // con.config.ConnectionConfig.database = db.db_name;
    // console.log(database.generate_sql(db, tables))
    // con.query(database.generate_sql(db, tables), (err, result) => {
    //   console.log(err)
    //   console.log(result)
    // })
  },


  /**
   * @method generates SQL for schema creation
   * @returns {Promise.<void>}
   */
  generate_sql: (db, tables) => {
    let sql_string =
      "SET UNIQUE_CHECKS=0;" +
      "SET FOREIGN_KEY_CHECKS=0;" +
      "SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';" +
      `DROP SCHEMA IF EXISTS \`${db.db_name}\` ; CREATE SCHEMA IF NOT EXISTS \`${db.db_name}\`;` +
      `USE \`${db.db_name}\`\n;`
    for (let table of tables) {
      let table_sql = `DROP TABLE IF EXISTS  \`${db.db_name}\`.\`${table.name}\` ;CREATE TABLE IF NOT EXISTS \`${db.db_name}\`.\`${table.name}\` (
                        \`id\` INT NOT NULL AUTO_INCREMENT, `
      for (let prop of table.properties) {
        table_sql += `\`${prop.property_name}\` ${prop.type + (prop.size ? '(' + prop.size + ')' : '')} ${prop.is_nullable ? 'NULL' : 'NOT NULL'} ${prop.default ? 'DEFAULT ' + "'" + prop.default + "'" : ''},\n\t`
      }
      table_sql += '`is_deleted` SMALLINT NULL DEFAULT 0,`date_created` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,`date_modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,'
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
          table_sql += `CONSTRAINT \`${table.name}_${ass.name}_id\` FOREIGN KEY (\`${ass.name}_id\`) REFERENCES \`${db.db_name}\`.\`${ass.name}\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,`
        }
        table_sql = table_sql.slice(0, -1) // remove last trailing comma
      }

      table_sql += `);`
      sql_string += table_sql
    }
    console.log('SQL GENERATION SUCCESSFUL')
    return sql_string


  }
}
