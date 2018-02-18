const fs = require('fs');

module.exports = {
    write_route_from_template: (to, name) =>  {
        let from = path.join(__dirname, '..', 'templates/js', 'route.js');
        let data = fs.readFileSync(from, 'utf-8')
        let result = data.replace(/string to be replaced/g, 'replacement');


    // module.exports.write(to, );
    },


    write: (path, str, mode) => {
    fs.writeFileSync(path, str, { mode: mode || 0o666 });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
    }
}