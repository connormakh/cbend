const fs = require('fs');
const mkdirp = require('mkdirp')
const constants = require('./constants.json')
const sortedObject = require('sorted-object');


module.exports = {
    /**
     *
     * @param options.path
     * @param options.app_name
     * @param options.tables
     * @returns {Promise.<void>}
     */
    create_project_structure: async (options) => {
        await pv.mkdir(options.path)

        let app = pv.loadTemplate('js/app.js');
        let www = pv.loadTemplate('js/www');
        let route_data = pv.loadTemplate('js/routes/route.js');

        await Promise.all([
            pv.mkdir(options.path + constants.routes_dir),
            pv.mkdir(options.path + constants.objects_dir),
            pv.mkdir(options.path + constants.models_dir),
        ])

        // package.json
        let pkg = {
            name: options.app_name
            , version: '0.0.0'
            , private: true
            , scripts: { start: 'node ./bin/www' }
            , dependencies: {
                'express': '~4.13.1',
                'body-parser': '~1.13.2',
                'cookie-parser': '~1.3.5',
            }
        }
        pkg.dependencies = sortedObject(pkg.dependencies);

        // write files
        pv.write(path + '/package.json', JSON.stringify(pkg, null, 2));
        pv.write(path + '/app.js', app);
        pv.mkdir(path + '/bin', function(){
            www = www.replace('{name}', app_name);
            pv.write(path + '/bin/www', www, 0o755);
            complete();
        });

        if (program.git) {
            pv.write(path + '/.gitignore', fs.readFileSync(__dirname + '/../templates/js/gitignore', 'utf-8'));
        }


    },

    check_for_empty_directory: async (path) => {
        let files = await fs.readdir(path)
        return !files || !files.length;
    }
}


const pv = {
    mkdir: async (path) => {
        return await mkdirp(path, 0o755)
    },
    write: (path, str, mode) => {
    fs.writeFileSync(path, str, { mode: mode || 0o666 });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
    },
    loadTemplate: (name) => {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf-8');
    },



}