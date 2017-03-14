"use strict";

/**
 * Redimensiona imagem.
 * Parâmetro:
 *  path: caminho físico da imagem
 *  w: largura
 *  h: altura
 *  q: qualidade
 */
module.exports = function(path, w, h, q) {
  
  var jimp = require("jimp");

  jimp.read(path, function(error, img) {
    if (img) {
      img.resize(w, h).quality(q).write(path);
    }
  });
  
};