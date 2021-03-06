"use strict";

define(function (require) {
  var Postmonger = require("postmonger");
  var connection = new Postmonger.Session();

  var payload = {};
  var authTokens = {};

  var eventDefinitionKey = null;
  var campanha = null;
  var perfilEnvio = null;
  var textoMensagem = null;
  var lalongcode = null;

  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on("requestedInteraction", requestedInteractionHandler);
  connection.on("clickedNext", save);

  /* [ Form Validate ] ================================================================== */

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass("alert-validate");
  }

  function validate_field(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if (
        $(input).val().trim() == "" ||
        $(input).val().trim() == "conta de envio*"
      ) {
        return false;
      }
    }
  }

  function validate() {
    var input = $(".validate-input .input100");
    var check = true;
    for (var i = 0; i < input.length; i++) {
      if (validate_field(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }
    return check;
  }

  /* ![ Form Validate ] ================================================================== */

  function onRender() {
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");
    connection.trigger("requestInteraction");

    $("#toggleActive").click(function (evt) {
      evt.preventDefault();

      if (validate()) {
        document.getElementById("campanha").disabled = true;
        campanha = $("#campanha").val();

        document.getElementById("perfilEnvio").disabled = true;
        perfilEnvio = $("#perfilEnvio").val();

        document.getElementById("textoMensagem").disabled = true;
        textoMensagem = $("#textoMensagem").val();

        document.getElementById("lalongcode").disabled = true;
        lalongcode = $("#lalongcode").val();

        document.getElementById("toggleActive").disabled = true;
        document.getElementById("toggleActive").innerHTML = "Ativado";
      }
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    campanha = payload["arguments"].campanha;

    if (campanha) {
      document.getElementById("campanha").disabled = true;
      document.getElementById("campanha").value = campanha;

      document.getElementById("perfilEnvio").disabled = true;
      document.getElementById("perfilEnvio").value = campanha;

      document.getElementById("textoMensagem").disabled = true;
      document.getElementById("textoMensagem").value = campanha;

      document.getElementById("lalongcode").disabled = true;
      document.getElementById("lalongcode").value = campanha;

      document.getElementById("toggleActive").disabled = true;
      document.getElementById("toggleActive").innerHTML = "Ativado";
    }
  }

  function onGetTokens(tokens) {
    // console.log(tokens);
    authTokens = tokens;
  }

  function onGetEndpoints(endpoints) {
    // console.log(endpoints);
  }

  function requestedInteractionHandler(settings) {
    try {
      eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
      document.getElementById("select-entryevent-defkey").value =
        eventDefinitionKey;
    } catch (err) {
      console.error(err);
    }
  }

  function save() {
    payload["arguments"].execute.inArguments = [
      {
        tokens: authTokens,
        campanha: campanha,
        perfilEnvio: perfilEnvio,
        textoMensagem: textoMensagem,
        lalongcode: lalongcode,
      },
    ];

    payload["metaData"].isConfigured = true;

    console.log("payload", JSON.stringify(payload));

    connection.trigger("updateActivity", payload);
  }
});
