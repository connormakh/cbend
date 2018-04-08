const express = require('express')
  , router = express.Router()
  , route_control = require('../utils/route_control')
  , a = require('await-to-js')
  , app = require('../app')
  , {table_name} = require('../objects/{table_name}')
  // , passport = require('passport')
  // , authentication = require('../../slc/authenticate')(app, passport)

/**
 * @route create a new {table_name}
 */
router.post('/new', async (req, res) => {

  let [err, response] = await a.to(route_control.call_function({table_name}, "create", [req.body]))

  if (err) {
    res.status(400).send(err);
  } else {
    res.status(response.code).send(response);
  }
});

/**
 * @route get a {table_name}
 */
router.get('/:id', async (req, res) => {

  let [err, response] = await a.to(route_control.call_function({table_name}, "get", [req.params.id]))

  if (err) {
    res.status(400).send(err);
  } else {
    res.status(response.code).send(response);
  }
});

/**
 * @route delete a {table_name}
 */
router.post('/delete/:id', async (req, res) => {

  let [err, response] = await a.to(route_control.call_function({table_name}, "delete", [req.params.id]))

  if (err) {
    res.status(400).send(err);
  } else {
    res.status(response.code).send(response);
  }
});

/**
 * @route update a {table_name}
 */
router.post('/update/:id', async (req, res) => {

  let [err, response] = await a.to(route_control.call_function({table_name}, "update", [req.body]))

  if (err) {
    res.status(400).send(err);
  } else {
    res.status(response.code).send(response);
  }
});

module.exports = router