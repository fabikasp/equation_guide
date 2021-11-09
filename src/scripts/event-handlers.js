$(document).ready(function () {
  /* start button functionality */
  $(document).on("click", "#start-button", function(event) {
    var leftEquationPart = $("#left-equation-input").val();
    var rightEquationPart = $("#right-equation-input").val();

    $.getScript("../scripts/functions.js", function() {
      var equationValid = startEquationIsValid();
    });

    $.getScript("../scripts/templates.js", function() {
      $("#equation-rearrangement-div").append(
        RearrangementTemplate({
          leftEquationPart: leftEquationPart,
          rightEquationPart: rightEquationPart
        })
      );

      $("#start-button").replaceWith(RestartButtonTemplate);
    });

    $(".equation-input").attr("readonly", true);

    event.preventDefault();
  });

  /* rearrangement button functionality */
  $(document).on("click", ".rearrangement-button", function(event) {
    var leftEquationPart = $(".left-rearrangement-input").last().val();
    var rightEquationPart = $(".right-rearrangement-input").last().val();
    var arithmeticOperation = $(".arithmetic-operation-select option:selected")
      .last()
      .text();
    var rearrangementStep = $(".rearrangement-step-input").last().val();

    $(".arithmetic-operation-select").last().attr("readonly", true);
    $(".rearrangement-step-input").last().attr("readonly", true);
    $(".rearrangement-button").last().attr("disabled", true);

    $.getScript("../scripts/functions.js", function() {
      var rearrangementValid = rearrangementIsValid();

      performRearrangement();
    });

    $.getScript("../scripts/templates.js", function() {
      $("#equation-rearrangement-div").append(
        RearrangementTemplate({
          leftEquationPart: leftEquationPart,
          rightEquationPart: rightEquationPart
        })
      );
    });

    event.preventDefault();
  });

  /* restart button functionality */
  $(document).on("click", "#restart-button", function(event) {
    $(".equation-rearrangement-step-div").remove();
    $("#left-equation-input").attr("readonly", false);
    $("#left-equation-input").val("");
    $("#right-equation-input").attr("readonly", false);
    $("#right-equation-input").val("");

    $.getScript("../scripts/templates.js", function() {
      $("#restart-button").replaceWith(StartButtonTemplate);
    });

    event.preventDefault();
  });
});
