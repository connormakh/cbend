const fs = require('fs');

module.exports = {
    copy_template: (from, to) =>  {
    from = path.join(__dirname, '..', 'templates', from);
    write(to, fs.readFileSync(from, 'utf-8'));
    }
}