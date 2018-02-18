const os = require('os');
const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const constants = require('./constants.json')

module.exports = {
    ask_for_another_table: async () => {

        let input = await readline.question('Enter table name: ')
        if(!input || !input.length) throw new Error("No input name specified")

        let table = {name: input, properties: []}

    },
    confirm: (msg) => {
        let input = readline.question(msg)
        return /^y|yes|ok|true$/i.test(input)
    },
    prompt_for_tables: async () => {
        let confirmed = await module.exports.confirm(constants.initialize_table_creation_prompt)
        if(!confirmed) {
            console.log("Why are you even here? Proceeding..")
        }


    }




}