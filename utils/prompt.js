const os         = require('os')
  ,   fs         = require('fs')
  ,   path       = require('path')
  ,   readline   = require('readline-sync')
  ,   constants  = require('./constants.json')
  ,   inquirer   = require('inquirer')


module.exports = {

    confirm: (msg) => {
        let input = readline.question(msg)
        return /^y|yes|ok|true$/i.test(input)
    },
    prompt_for_dialect: async () => {
        let questions = [{
            type: 'list',
            name: 'dialect',
            message: 'Choose dialect',
            choices: ['mysql', 'postgresql', 'mssql', 'mongoDB']
        }]

        return await inquirer.prompt(questions)
    },

    capture_all_tables: async() => {
        let confirm = false
        let tables = []
        do {
            let table = {name: await qs.ask_for_another_table(), properties:await qs.capture_all_properties()}
            // let properties =
            // table.properties = properties
            tables.push(table)
            let questions = [{
                type: 'list',
                name: 'confirmation',
                message: 'Would you like to add another table?',
                choices: ['Yes', 'No']
            }]
            let answer = await inquirer.prompt(questions)
            confirm = answer.confirmation === 'Yes'
        } while (confirm)

        return tables
    },
    capture_all_associations: async (tables) => {

        let confirm = false
        let associations = []
        do {
            let association = await qs.ask_for_another_association(tables)
            associations.push(association)
            let question = [{
                type: 'list',
                name: 'confirmation',
                message: 'Would you like to add another association?',
                choices: ['Yes', 'No']
            }]
            let answer = await inquirer.prompt(question)
            confirm = answer.confirmation == 'Yes'
        }
        while(confirm)

        return associations
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
    ask_for_another_association: async(tables) => {

        let questions = [
            {
                type: 'list',
                name: 'parent',
                message: 'Choose table that you want to add a child to',
                choices: tables.map(item => {return item.name})
            },{
                type: 'list',
                name: 'child',
                message: 'Choose child',
                choices: tables.map(item => {return item.name})
            },{
                type: 'list',
                name: 'type',
                message: 'Choose type of association',
                choices: ['hasOne', 'hasMany', 'belongsTo']
            }
        ]
        return await inquirer.prompt(questions)
    }
}