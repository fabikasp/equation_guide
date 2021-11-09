$(document).ready(function () {
  $("#start-form").on("submit", function(event) {

    //TODO: Validierung

    $.getScript("../scripts/templates.js",function() {
      $("#equation-rearrangement-div").append(
        RearrangementTemplate(
          {leftEquationPart: "test", rightEquationPart: "test"}
        )
      );

      $("#start-button").replaceWith(RestartButtonTemplate);
    });

    $(".equation-guide-equation-part-input").attr("readonly", true);

    event.preventDefault();
  });
});
