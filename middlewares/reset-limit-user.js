"use strict";

/**
 * Reseta limite de solicitações do usuário.
 * Parâmetro:
 *  userModel: objeto de modelo para usuário
 */
module.exports = function(userModel) {
  
  var d = new Date();
  
  if (d.getDate() == 1) {
    userModel.update({}, {limit: 0}, {multi: true}, function(error) {
      if (error) {
        console.log(error);
      }
    });
  }
  
};