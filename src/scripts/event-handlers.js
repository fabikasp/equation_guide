$(document).ready(function () {
  /* start button functionality */
  $("#start-button").on("click", function(event) {
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
  $(".rearrangement-button").on("click", function(event) {
    alert("test123");
    var leftEquationPart = "";
    var rightEquationPart = "";
    var arithmeticOperation = "";
    var rearrangementStep = "";

    alert("test");

    $(".arithmetic-operation-select").last().attr("readonly", true);

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
});
