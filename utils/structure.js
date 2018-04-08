const fs = require('fs');
const mkdirp = require('mkdirp')
const constants = require('./constants.json')
const sortedObject = require('sorted-object');
const path = require('path')


const structure = module.exports = {

  create_project_directory: async(options) => {
    const complete_path = options.app.path + '/' + options.app.app_name
    await pv.mkdir(complete_path)

    await Promise.all([
      pv.mkdir(complete_path + constants.routes_dir),
      pv.mkdir(complete_path + constants.objects_dir),
      pv.mkdir(complete_path + constants.models_dir),
      pv.mkdir(complete_path + constants.utils_dir),
      pv.mkdir(complete_path + constants.helper_dir),
    ])


    // write package.json file
    pv.write(complete_path + '/package.json', structure.generate_package(options.app.app_name));

    // write gitignore
    pv.write(complete_path + '/.gitignore', pv.loadTemplate('js/gitignore'));

    // write app.js
    pv.write(complete_path + '/server.js', pv.loadTemplate('js/app.js'));

    // write utils
    pv.write(complete_path + constants.utils_dir + '/database.js', structure.generate_database_file(options.associations));
    pv.write(complete_path + constants.utils_dir + '/logger.js', pv.loadTemplate('js/utils/logger.js'));
    pv.write(complete_path + constants.utils_dir + '/route_control.js', pv.loadTemplate('js/utils/route_control.js'));

    // write helpers
    structure.generate_helpers(options.tables, complete_path + constants.helper_dir)

    // write objects
    structure.generate_objects(options.tables, complete_path + constants.objects_dir)

    // write routes
    structure.generate_routes(options.tables, complete_path + constants.routes_dir)


  },


  /**
   *
   * @param options.path
   * @param options.app_name
   * @param options.tables
   * @returns {Promise.<void>}
   */
  create_project_structure: async(options, paths) => {

    let app = pv.loadTemplate('js/app.js');
    let www = pv.loadTemplate('js/www');
    let route_data = pv.loadTemplate('js/routes/route.js');

    if (program.git) {
      pv.write(path + '/.gitignore', fs.readFileSync(__dirname + '/../templates/js/gitignore', 'utf-8'));
    }
  },

  generate_package: (app_name) => {
    // package.json
    let pkg = {
      name: app_name
      , version: '0.0.0'
      , private: true
      , scripts: {start: 'node ./bin/www'}
      , dependencies: {
        'express': '~4.13.1',
        'body-parser': '~1.13.2',
        'cookie-parser': '~1.3.5',
        'await-to-js': '^2.0.1',
        'sequelize': '^4.28.6',
        'sequelize-auto': '^0.4.29',
        'sequelize-auto-import': '^1.1.0',
        'sequelize-to-json': '^0.10.3',
        'tracer': '^0.8.11',
      }
    }
    pkg.dependencies = sortedObject(pkg.dependencies);

    return JSON.stringify(pkg, null, 2)

  },

  generate_database_file: (associations) => {
    let associations_string = ''
    for (let ass of associations) {
      associations_string += `\ndatabase.get_model(\'${ass.parent}\').${ass.type}(database.get_model(\'${ass.child}\'))`
    }
    let db_file = pv.loadTemplate('js/utils/database.js')

    return db_file.replace('{associations}', associations_string)

  },

  generate_helpers: (tables, helpers_path) => {
    let helper_template = pv.loadTemplate('js/helpers/helper.js')
    for (let table of tables) {
      console.log(helpers_path + '/' + table.name + '.js')
      pv.write(helpers_path + '/' + table.name + '.js', helper_template.replace(/\{table_name}/g, table.name))
    }
  },

  generate_objects: (tables, objects_path) => {
    let helper_template = pv.loadTemplate('js/objects/object.js')
    for (let table of tables) {
      pv.write(objects_path + '/' + table.name + '.js', helper_template.replace(/\{table_name}/g, table.name))
    }
  },

  generate_routes: async(tables, routes_path) => {
    let helper_template = pv.loadTemplate('js/routes/route.js')
    let index_template = pv.loadTemplate('js/routes/index.js')
    let index_string = ''
    for (let table of tables) {
      pv.write(routes_path + '/' + table.name + '.js', helper_template.replace(/\{table_name}/g, table.name))
      index_string += '\nrouter.use(\'/' + table.name + '\', require(\'./' + table.name + '\'))'
    }
    pv.write(routes_path + '/index.js', index_template.replace(/\{route_imports}/g, index_string))

  },

  generate_lib: (options) => {

  },

  check_for_empty_directory: async(path) => {
    let files = await fs.readdir(path)
    return !files || !files.length;
  },

  link_tables_associations: (tables, associations) => {
    for (let ass of associations) {
      const index = tables.findIndex(item => item.name == ass.child)
      switch (ass.type) {
        case "hasOne":
          if (tables[index].associations) {
            tables[index].associations.push({name: ass.parent, is_nullable: ass.is_nullable})
          } else {
            tables[index].associations = [{name: ass.parent, is_nullable: ass.is_nullable}]
          }
          break
        case "hasMany":
          if (tables[index].associations) {
            tables[index].associations.push({name: ass.parent, is_nullable: ass.is_nullable})
          } else {
            tables[index].associations = [{name: ass.parent, is_nullable: ass.is_nullable}]
          }
          break
        case "belongsTo":
          const pindex = tables.findIndex(item => item.name == ass.parent)
          if (tables[pindex].associations) {
            tables[pindex].associations.push({name: ass.child, is_nullable: ass.is_nullable})
          } else {
            tables[pindex].associations = [{name: ass.child, is_nullable: ass.is_nullable}]
          }
          break
      }
    }
    return tables
  },

  backup_answers: (options) => {
    pv.write('./backup.json', JSON.stringify(options))
  },

  backup_exists: () => {
    return fs.existsSync('./backup.json') && fs.readFileSync('./backup.json')
  },
  get_backup: () => {
    return JSON.parse(fs.readFileSync('./backup.json'))
  }


}


const pv = {
  mkdir: async(path) => {
    console.log("create " + path)
    return await mkdirp(path, 0o755)
  },
  write: (filepath, str, mode) => {
    console.log('--------str----------')
    fs.writeFileSync(path.resolve(filepath), str, {mode: mode || 0o666});
    console.log('   \x1b[36mcreate\x1b[0m : ' + filepath);
  },
  loadTemplate: (name) => {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf-8');
  }
}
