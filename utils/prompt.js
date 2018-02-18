const os = require('os');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports = {
    ask_for_another_table: async () => {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let input = await rl.question('Enter table name: ')
        rl.close();
        if(!input || !input.length) throw new Error("No input name specified")

    },
    confirm: async (msg) => {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let input = await rl.question(msg)
    rl.close();

    return !!input.length
    },


}