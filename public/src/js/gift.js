"use strict";

/**
 * Verifica se o título é válido e transmite informação para o usuário.
 * Parâmetros:
 *  $input: caixa de texto que disparou a ação
 *  $label: campo de texto que descreve a caixa de texto
 * Retorna:
 *  true, caso título seja válido
 *  false, caso contrário
 */
exports.verifyTitleAndInformUser = function($input, $label) {

  var isValidTitle = require("./../../../middlewares/is-valid-title");
  
  if (!$input.val()) {
    $input.removeClass("invalid valid");
    $label.attr("data-error", '');
    return false;
  }
  else if (!isValidTitle($input.val())) {
    $input.addClass("invalid").removeClass("valid");
    $label.attr("data-error", "Mínimo de 3 caracteres, não é aceito caracteres especiais.");
    return false;
  }
  
  $input.addClass("valid").removeClass("invalid");
  return true;
  
};

/**
 * Verifica se a descrição é válida e transmite informação para o usuário.
 * Parâmetros:
 *  $input: caixa de texto que disparou a ação
 *  $label: campo de texto que descreve a caixa de texto
 * Retorna:
 *  true, caso descrição seja válida
 *  false, caso contrário
 */
exports.verifyDescriptionAndInformUser = function($input, $label) {

  var isValidDescription = require("./../../../middlewares/is-valid-description");
  
  if (!$input.val()) {
    $input.removeClass("invalid valid");
    $label.attr("data-error", '');
    return false;
  }
  else if (!isValidDescription($input.val())) {
    $input.addClass("invalid").removeClass("valid");
    $label.attr("data-error", "Mínimo de 10 caracteres, não é aceito caracteres especiais.");
    return false;
  }
  
  $input.addClass("valid").removeClass("invalid");
  return true;
  
};

/**
 * Verifica se a quantidade é válida e transmite informação para o usuário.
 * Parâmetros:
 *  $input: caixa de texto que disparou a ação
 *  $label: campo de texto que descreve a caixa de texto
 * Retorna:
 *  true, caso quantidade seja válida
 *  false, caso contrário
 */
exports.verifyAmountAndInformUser = function($input, $label) {
  
  if (!$input.val()) {
    $input.removeClass("invalid valid");
    $label.attr("data-error", '');
    return false;
  }
  else if ($input.val() <= 0 || !$.isNumeric($input.val())) {
    $input.addClass("invalid").removeClass("valid");
    $label.attr("data-error", "A quantidade deve ser no mínimo 1.");
    return false;
  }
  
  $input.addClass("valid").removeClass("invalid");
  return true;
  
};

/**
 * Verifica se as fotos possuem as extensões permitidas.
 * Parâmetros:
 *  $input: caixa de texto que disparou a ação
 *  $label: campo de texto que descreve a caixa de texto
 * Retorna:
 *  true, caso extensão seja válido
 *  false, caso contrário
 */
exports.verifyPhotoAndInformUser = function($input, $label) {
  
  var files = $input.val().split(',');
  
  for (var i = 0, len = files.length; i < len; i++) {
    if (!files[i].match(/\.(jpg|jpeg|png|gif)$/)) {
      $input.addClass("invalid").removeClass("valid");
      return false;
    }
  }
  
  $input.addClass("valid").removeClass("invalid");
  return true;
  
};