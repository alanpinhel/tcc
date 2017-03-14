"use strict";

/**
 * Centraliza as ações dos usuários na camada de visão de todas as páginas.
 */
(function main() {
  
  var element = require("./element") // Funções relacionadas a elementos DOM
    , user = require("./user")       // Funções relacionadas a User
    , gift = require("./gift")       // Funções relacionadas a Gift
  ;
  var idBtnPass                      // ID do botão de senha pressionado
    , validIdent = false             // Identificador válido?
    , validName = false              // Nome válido?
    , validPass = false              // Senha válida?
    , validTitle = false             // Título válido?
    , validDescription = false       // Descrição válida?
    , validAmount = false            // Quantidade válida?
    , validPhoto = false             // Foto válida?
  ;
  var currentPass = {                // Conteúdo atual da senha
    '1':'w',
    '2':'w',
    '3':'w',
    '4':'w',
    '5':'w',
    '6':'w',
    '7':'w',
    '8':'w',
    '9':'w'
  };
  
  $("#ident").on("input", function() {
    validIdent = user.verifyIdentAndInformUser($(this), $("#lbIdent"));
  });
  
  $("#name").on("input", function() {
    validName = user.verifyNameAndInformUser($(this), $("#lbName"));
  });
  
  $(".modal-trigger").leanModal({
    in_duration: 0,
    out_duration: 0
  });
  
  $("#passHelp").click(function() {
    var src = "//www.youtube.com/embed/eIRu-ALuA8c"
      , video = $("#videoHelp")
    ;
    element.reloadVideo(src, video);
  });
  
  $(".btn-pass").click(function() {
    idBtnPass = $(this).prop("id");
  });
  
  $(".btn-color").click(function() {
    var $btnPass = $('#' + idBtnPass)
      , $pass = $("#pass")
      , color = $(this).prop("id")
    ;
    element.setColorButton($btnPass, color);
    currentPass = element.changePassword(idBtnPass, color, currentPass, $pass);
    validPass = user.verifyPassword($pass);
  });
  
  $("#signup #submit").click(function() {
    if (!validIdent || !validName || !validPass) return false;
  });
  
  $("#login #submit").click(function() {
    // Prevê tentativas de login incorretas.
    validIdent = user.verifyIdentAndInformUser($("#ident"), $("#lbIdent"));
    if (!validIdent || !validPass) return false;
  });
  
  $("#recover #submit").click(function() {
    if (!validIdent) return false;
  });
  
  $("#reset #submit").click(function() {
    if (!validPass) return false;
  });
  
  $(".button-collapse").sideNav();
  
  $("#title").on("input", function() {
    validTitle = gift.verifyTitleAndInformUser($(this), $("#lbTitle"));
  });
  
  $("#description").on("change keyup paste", function() {
    validDescription = gift.verifyDescriptionAndInformUser($(this), $("#lbDescription"));
  });
  
  $("#amount").on("input", function() {
    validAmount = gift.verifyAmountAndInformUser($(this), $("#lbAmount"));
  });
  
  $("#path").change(function() {
    validPhoto = gift.verifyPhotoAndInformUser($(this), $("#lbPath"));
  });
  
  $("#giftCreate #submit").click(function() {
    if (!validTitle || !validDescription || !validAmount || !validPhoto) return false;
    $("#progressBar").removeClass("hide");
  });
  
  $("#edit #submit").click(function() {
    $("#progressBar").removeClass("hide");
  });
  
  $('#selectType').val($('#type').val());
  
  $('.slider').slider({full_width: false});
  
  $('.materialboxed').materialbox();
  
  $('.parallax').parallax();

})();