const database = require('./database.js');
//const authenticate = require('./authenticate');
//const synchronisation = require('./synchronisation');
const logger = require('./logger');
const a = require('await-to-js')

const route_control = {

  call_function: async(obj, function_name, function_params) => {

    let [err, result] = await a.to(obj[function_name].apply(null, function_params))

    if (err) {
      logger.error('Error Executing function',[obj,function_name, function_params])
      return route_control.build_response_params({data: '', code: 400, message: err.message})
    } else {
      return route_control.build_response_params(result)
    }
  },


  build_response_params: (response) => {

    return {
      data: response.data ? response.data : response,
      code: response.code ? response.code : 200,
      message: response.message ? response.message : 'No message specified'
    };
  }

}

module.exports = route_control;
