"use strict";

/**
 * Verifica se identificador é válido e transmite informação para o usuário.
 * Parâmetros:
 *  $input: caixa de texto que disparou a ação
 *  $label: campo de texto que descreve a caixa de texto
 * Retorna:
 *  true, caso identificador seja válido
 *  false, caso contrário
 */
exports.verifyIdentAndInformUser = function($input, $label) {
  
  var isValidCell = require("./../../../middlewares/is-valid-cell")
    , isValidEmail = require("./../../../middlewares/is-valid-email")
  ;
  
  if (!$input.val()) {
    $input.removeClass("invalid valid");
    $label.attr("data-error", '');
    return false;
  }
  else if ($.isNumeric($input.val())) {
    if ($input.val().charAt() == 0) {
      $input.addClass("invalid").removeClass("valid");
      $label.attr("data-error", "Por favor, coloque o DDD sem o zero.");
      return false;
    }
    if (!isValidCell($input.val())) {
      $input.addClass("invalid").removeClass("valid");
      $label.attr("data-error", "Celular incorreto.");
      return false;
    }
  }
  else if (!isValidEmail($input.val())) {
    $input.addClass("invalid").removeClass("valid");
    $label.attr("data-error", "E-mail incorreto.");
    return false;
  }
  
  $input.addClass("valid").removeClass("invalid");
  return true;
  
};

/**
 * Verifica se o nome é válido e transmite informação para o usuário.
 * Parâmetros:
 *  $input: caixa de texto que disparou a ação
 *  $label: campo de texto que descreve a caixa de texto
 * Retorna:
 *  true, caso nome seja válido
 *  false, caso contrário
 */
exports.verifyNameAndInformUser = function($input, $label) {
  
  var isValidName = require("./../../../middlewares/is-valid-name");
  
  if (!$input.val()) {
    $input.removeClass("invalid valid");
    $label.attr("data-error", '');
    return false;
  }
  if (!isValidName($input.val())) {
    $input.addClass("invalid").removeClass("valid");
    $label.attr("data-error", "Nome incorreto.");
    return false;
  }
  
  $input.addClass("valid").removeClass("invalid");
  return true;
  
};

/**
 * Verifica se senha atende aos padrões necessários.
 * Parâmetros:
 *  $input: caixa de texto com o conteúdo a ser analisado
 * Retorna:
 *  true, caso nome seja válido
 *  false, caso contrário
 */
exports.verifyPassword = function($input) {
  
  var isValidPass = require("./../../../middlewares/is-valid-pass");
  
  if (!isValidPass($input.val())) {
    return false;
  }
  
  return true;
  
};