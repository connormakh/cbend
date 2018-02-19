const os        = require('os')
  ,   fs        = require('fs')
  ,   path      = require('path')
  ,   readline  = require('readline-sync')
  ,   constants = require('./constants.json')
  ,   inquirer   = require('inquirer')


module.exports = {

    confirm: (msg) => {
        let input = readline.question(msg)
        return /^y|yes|ok|true$/i.test(input)
    },
    prompt_for_tables:  () => {
        return module.exports.confirm(constants.initialize_table_creation_prompt)
    },


    capture_all_tables: async() => {
        let confirm = false
        let tables = []
        do {
            let table = await qs.ask_for_another_table()
            let properties = await qs.capture_all_properties()
            table.properties = properties
            let questions = [{
                type: 'list',
                name: 'confirmation',
                message: 'Would you like to add another table?',
                choices: ['Yes', 'No']
            }]
            let answer = await inquirer.prompt(questions)
            confirm = answer.confirmation === 'Yes'
        } while (confirm)
    }
}

const qs = {
    ask_for_another_property: async () => {

        let questions = [
            {
                type: 'input',
                name: 'property_name',
                message: 'Enter Property name (Leave empty to break)'
            }
            ,{
                type: 'list',
                name: 'type',
                message: 'What type of property is this?',
                choices: ['VARCHAR', 'Number', 'TIMESTAMP'],
                filter: function (val) {
                    return val.toLowerCase();
                }
            }]
        let answers = await inquirer.prompt(questions)
        if(answers.type == "varchar") {
            let size = await inquirer.prompt([{type:'input',name:'size',message:'Enter VARCHAR size'}])
            answers['size'] = size.size
        }
        return answers
        // if(answers)
    },
    ask_for_another_table: async () => {

        let questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter Table name'
            }]
        let answers = await inquirer.prompt(questions)
        return answers.name

    },
    capture_all_properties: async() => {

        let confirm = false
        let props = []
        do {
            let property = await qs.ask_for_another_property()
            props.push(property)
            let questions = [{
                type: 'list',
                name: 'confirmation',
                message: 'Would you like to add another property?',
                choices: ['Yes', 'No']
            }]
            let answer = await inquirer.prompt(questions)
            confirm = answer.confirmation === 'Yes'
        } while (confirm)

        return props
    },
}