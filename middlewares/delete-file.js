"use strict";

/**
 * Exclui arquivo.
 * Parâmetro:
 *  path: caminho físico do arquivo a ser excluído
 */
module.exports = function(path) {

  var fs = require("fs");
  
  fs.unlink(path);
  
};