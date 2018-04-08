const os = require('os')
  , fs = require('fs')
  , path = require('path')
  , readline = require('readline-sync')
  , constants = require('./constants.json')
  , inquirer = require('inquirer')


module.exports = {

  confirm: (msg) => {
    let input = readline.question(msg)
    return /^y|yes|ok|true$/i.test(input)
  },
  capture_app_details: async() => {
    let questions = [
      {
        type: 'input',
        name: 'app_name',
        message: 'Enter Application name'
      },
      {
        type: 'input',
        name: 'path',
        message: 'Enter Application path'
      }
    ]
    return await inquirer.prompt(questions)
  },
  capture_db: async() => {
    let questions = [
      {
        type: 'input',
        name: 'db_name',
        message: 'Enter Database name'
      },
      {
        type: 'list',
        name: 'dialect',
        message: 'Choose dialect',
        choices: ['mysql', 'postgresql', 'mssql', 'mongoDB']
      }
    ]
    return await inquirer.prompt(questions)
  },
  capture_all_tables: async() => {
    let confirm = false
    let tables = []
    do {
      let table = {name: await qs.ask_for_another_table(), properties: await qs.capture_all_properties()}
      // let properties =
      // table.properties = properties
      tables.push(table)
      let questions = [{
        type: 'list',
        name: 'confirmation',
        message: 'Would you like to add another table?',
        choices: ['No', 'Yes']
      }]
      let answer = await inquirer.prompt(questions)
      confirm = answer.confirmation === 'Yes'
    } while (confirm)

    return tables
  },
  capture_all_associations: async(tables) => {

    let confirm = false
    let associations = []
    do {
      let association = await qs.ask_for_another_association(tables)
      associations.push(association)
      let question = [{
        type: 'list',
        name: 'confirmation',
        message: 'Would you like to add another association?',
        choices: ['No', 'Yes']
      }]
      let answer = await inquirer.prompt(question)
      confirm = answer.confirmation == 'Yes'
    }
    while (confirm)


    return associations
  },
  ask_for_backup: async() => {
    let question = [{
      type: 'list',
      name: 'confirmation',
      message: 'A backup file was found, would you like to use it?',
      choices: ['No', 'Yes']
    }]
    let answer = await inquirer.prompt(question)
    return answer.confirmation == 'Yes'
  }
}

const qs = {
  ask_for_another_property: async() => {

    let questions = [
      {
        type: 'input',
        name: 'property_name',
        message: 'Enter Property name (Leave empty to break)'
      }
      , {
        type: 'list',
        name: 'type',
        message: 'What type of property is this?',
        choices: ['VARCHAR', 'CHAR', 'SMALLINT', 'DATE', 'INT', 'TIMESTAMP'],
        filter: (val) => {
          return val.toUpperCase();
        }
      },
      {
        type: 'list',
        name: 'is_nullable',
        message: 'Can it be null?',
        choices: ['no', 'yes'],
        filter: (val) => {
          return val === 'yes'
        }
      },
      {
        type: 'input',
        name: 'default',
        message: 'Default value:'
      }
    ]
    let answers = await inquirer.prompt(questions)
    if (answers.type == "VARCHAR" || answers.type == "CHAR" || answers.type == "SMALLINT") {
      let size = await inquirer.prompt([{type: 'input', name: 'size', message: 'Enter VARCHAR size'}])
      answers['size'] = size.size
    }
    return answers
    // if(answers)
  },
  ask_for_another_table: async() => {

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
        choices: ['No', 'Yes']
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
        choices: tables.map(item => {
          return item.name
        })
      }, {
        type: 'list',
        name: 'child',
        message: 'Choose child',
        choices: tables.map(item => {
          return item.name
        })
      }, {
        type: 'list',
        name: 'type',
        message: 'Choose type of association',
        choices: ['hasOne', 'hasMany', 'belongsTo']
      },
      {
        type: 'list',
        name: 'is_nullable',
        message: 'Can it be null?',
        choices: ['no', 'yes'],
        filter: (val) => {
          return val === 'yes'
        }
      },
    ]
    return await inquirer.prompt(questions)
  }
}
