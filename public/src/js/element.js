"use strict";

/**
 * Dado uma URL e um elemento vídeo é feito o recarregamento.
 * Parâmetros:
 *  src: url do vídeo a ser recarregado
 *  $video: elemento vídeo a receber url
 */
exports.reloadVideo = function(src, $video) {
  
  $video.prop("src", '');
  $video.prop("src", src);
  
};

/**
 * Aplica cor de fundo a um botão.
 * Parâmetros:
 *  $btn: elemento tipo botão que receberá cor de fundo
 *  color: cor a ser aplicada ao botão
 */
exports.setColorButton = function($btn, color) {
  $btn.removeClass("white red green blue").addClass(color);
};

/**
 * Altera conteúdo do campo senha.
 * Parâmetro:
 *  id: índice do valor a ser alterado
 *  color: cor a ser persistida no índice informado
 *  current: configuração atual do arranjo de senha
 *  $input: elemento HTML a ser alterado
 * Retorna:
 *  configuração do arranjo de senha atualizado
 */
exports.changePassword = function(id, color, current, $input) {
  
  var content;
  
  current[id] = color.substr(0, 1);
  for (var i = 1; i <= 9; i++) {
    if (i === 1) content = '|';
    content += i + ':' + current[i] + '|';
  }
  $input.val(content);
  
  return current;
  
};