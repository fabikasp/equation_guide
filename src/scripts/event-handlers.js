$(document).ready(function () {
  $(StartButtonTemplate).insertAfter($("#back-button"));

  $("#left-equation-input").focus();

  /* start button functionality */
  $(document).on("click", "#start-button", function(event) {
    var leftEquationPart = $("#left-equation-input").val();
    var rightEquationPart = $("#right-equation-input").val();
    var variable = $("#variable-input").val();

    $("#alert-div").empty();

    $.getScript("../scripts/functions.js", function() {
      leftEquationPart = simplifyExpression(leftEquationPart);
      rightEquationPart = simplifyExpression(rightEquationPart);

      var startEquationEvaluation = evaluateStartEquations(
        leftEquationPart,
        rightEquationPart,
        variable
      );

      if (startEquationEvaluation.errorMessages.length > 0) {
        startEquationEvaluation.errorMessages.forEach((errorMessage, i) => {
          $("#alert-div").append(
            AlertTemplate({text: errorMessage, alertType: "danger"})
          );
        });
      }

      if (!startEquationEvaluation.leftEquationValid) {
        $("#left-equation-input").addClass("is-invalid");
        $("#left-equation-input").focus();
      } else {
        $("#left-equation-input").removeClass("is-invalid");
      }

      if (!startEquationEvaluation.rightEquationValid) {
        $("#right-equation-input").addClass("is-invalid");

        if (startEquationEvaluation.leftEquationValid) {
          $("#right-equation-input").focus();
        }
      } else {
        $("#right-equation-input").removeClass("is-invalid");
      }

      if (!startEquationEvaluation.variableValid) {
        $("#variable-input").addClass("is-invalid");

        if (
          startEquationEvaluation.leftEquationValid
          && startEquationEvaluation.rightEquationValid
        ) {
          $("#variable-input").focus();
        }
      } else {
        $("#variable-input").removeClass("is-invalid");
      }

      if (
        startEquationEvaluation.leftEquationValid
        && startEquationEvaluation.rightEquationValid
        && startEquationEvaluation.variableValid
      ) {
        $("#alert-div").empty();
        $(".equation-input").attr("readonly", true);

        $("#equation-rearrangement-div").append(
          RearrangementTemplate({
            leftEquationPart: leftEquationPart,
            rightEquationPart: rightEquationPart
          })
        );

        $("#start-button").replaceWith(RestartButtonTemplate);
      }
    });

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
    var variable = $("#variable-input").val();

    $("#alert-div").empty();

    $.getScript("../scripts/functions.js", function() {
      var rearrangementStepEvaluation = evaluateRearrangementStep(
        leftEquationPart,
        rightEquationPart,
        arithmeticOperation,
        rearrangementStep
      );

      if (rearrangementStepEvaluation == "") {
        $(".rearrangement-step-input").last().removeClass("is-invalid");

        $(".arithmetic-operation-select").last().attr("readonly", true);
        $(".rearrangement-step-input").last().attr("readonly", true);
        $(".rearrangement-button").last().attr("disabled", true);

        var newLeftEquationPart = performRearrangementStep(
          leftEquationPart,
          arithmeticOperation,
          rearrangementStep
        );

        var newRightEquationPart = performRearrangementStep(
          rightEquationPart,
          arithmeticOperation,
          rearrangementStep
        );

        $("#equation-rearrangement-div").append(
          RearrangementTemplate({
            leftEquationPart: newLeftEquationPart,
            rightEquationPart: newRightEquationPart
          })
        );

        if (
          isFinalEquation(newLeftEquationPart, newRightEquationPart, variable)
        ) {
          $(".arithmetic-operation-select").last().remove();
          $(".rearrangement-step-input").last().remove();
          $(".rearrangement-button").last().remove();

          $(".left-rearrangement-input").last().addClass("bg-success");
          $(".right-rearrangement-input").last().addClass("bg-success");
          $(".equals-sign-input").last().addClass("bg-success");
          $(".left-rearrangement-input").last().addClass("text-white");
          $(".right-rearrangement-input").last().addClass("text-white");
          $(".equals-sign-input").last().addClass("text-white");

          $("#alert-div").append(
            AlertTemplate({
              text: "Die Gleichung wurde erfolgreich umgeformt",
              alertType: "success"
            })
          );
        }
      } else {
        $(".rearrangement-step-input").last().addClass("is-invalid");

        $("#alert-div").append(
          AlertTemplate({
            text: rearrangementStepEvaluation,
            alertType: "danger"
          })
        );
      }
    });

    event.preventDefault();
  });

  /* restart button functionality */
  $(document).on("click", "#restart-button", function(event) {
    $("#alert-div").empty();

    $(".equation-rearrangement-step-div").remove();
    $("#left-equation-input").attr("readonly", false);
    $("#right-equation-input").attr("readonly", false);
    $("#variable-input").attr("readonly", false);
    $("#left-equation-input").val("");
    $("#right-equation-input").val("");
    $("#variable-input").val("");
    $("#left-equation-input").focus();

    $("#restart-button").replaceWith(StartButtonTemplate);

    event.preventDefault();
  });

  $(document).on("click", "#help-button", function(event) {
    window.mathstepsTestFunction();
    event.preventDefault();
  });
});
