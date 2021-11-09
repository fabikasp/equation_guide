const { RearrangementTemplate, StartButtonTemplate, RestartButtonTemplate } = require('./templates.js');

$(document).ready(function () {
  $("#start-form").on("submit", function(event) {

    //TODO: Validierung

    $(".equation-guide-equation-part-input").attr("readonly", true);

    $("#equation-rearrangement-div").append(
      RearrangementTemplate(
        {leftEquationPart: "test", rightEquationPart: "test"}
      )
    );

    $("#start-button").replaceWith(RestartButtonTemplate);

    event.preventDefault();
  });
});
