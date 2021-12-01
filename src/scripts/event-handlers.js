$(document).ready(function () {
  $(StartButtonTemplate).insertAfter($("#back-button"));

  $('[data-toggle="tooltip"]').tooltip("enable");

  $("#left-equation-input").focus();

  /* start button functionality */
  $(document).on("click", "#start-button", function (event) {
    var leftEquationPart = $("#left-equation-input").val().toString().trim();
    var rightEquationPart = $("#right-equation-input").val().toString().trim();
    var variable = $("#variable-input").val().toString().trim();

    $("#alert-div").empty();

    leftEquationPart = window.simplifyExpression(leftEquationPart);
    rightEquationPart = window.simplifyExpression(rightEquationPart);

    var startEquationEvaluation = window.evaluateStartEquation(
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
      // Start equation was evaluated successfully | generate feedback array with mathsteps | insert advice button
      $(AdviceButtonTemplate).insertAfter($("#start-button"));
      $("#advice-button").last().attr("disabled", window.checkIfEquationContainsRootOrPower(leftEquationPart, rightEquationPart));
      window.generateRearrangementStepsArray(leftEquationPart, rightEquationPart, variable);

      $("#alert-div").empty();
      $(".equation-input").attr("readonly", true);

      $("#equation-rearrangement-div").append(
        RearrangementTemplate({
          leftEquationPart: leftEquationPart,
          rightEquationPart: rightEquationPart
        })
      );

      $('[data-toggle="tooltip"]').tooltip("hide");

      $("#start-button").replaceWith(RestartButtonTemplate);

      if ($("#help-button").text().trim() == "Hilfe ausschalten") {
        $('[data-toggle="tooltip"]').tooltip("enable");
      }
    }

    event.preventDefault();
  });

  $(document).on("input", ".arithmetic-operation-select", function (event) {
    var arithmeticOperation = $(".arithmetic-operation-select option:selected").last().val().toString();

    disableRearrangementStep = ["^2", "sqrt"].includes(arithmeticOperation);

    $(".rearrangement-step-input").last().attr("readonly", disableRearrangementStep);

    if (disableRearrangementStep) {
      $(".rearrangement-step-input").last().val("");
    }

    event.preventDefault();
  });

  $(document).on("input", ".rearrangement-step-input", function (event) {
    var rearrangementStep = $(".rearrangement-step-input").last().val().toString().trim();

    if (rearrangementStep != "" && ["+", "-", "*", "/"].includes(rearrangementStep[0])) {
      $(".arithmetic-operation-select").last().val(rearrangementStep[0]);
      $(".rearrangement-step-input").last().val(rearrangementStep.substring(1));
    }

    event.preventDefault();
  });

  /* rearrangement button functionality */
  $(document).on("click", ".rearrangement-button", function (event) {
    var leftEquationPart = $(".left-rearrangement-input").last().val().toString().trim();
    var rightEquationPart = $(".right-rearrangement-input").last().val().toString().trim();
    var arithmeticOperation = $(".arithmetic-operation-select option:selected").last().val().toString();
    var rearrangementStep = $(".rearrangement-step-input").last().val().toString().trim();
    var variable = $("#variable-input").val().toString().trim();

    $("#alert-div").empty();

    var rearrangementStepEvaluation = window.evaluateRearrangementStep(
      leftEquationPart,
      rightEquationPart,
      arithmeticOperation,
      rearrangementStep
    );

    if (rearrangementStepEvaluation === "") {
      if (
        $(".left-rearrangement-input").length > 0
        && $("#reset-button").length == 0
      ) {
        $(AdviceButtonTemplate).insertAfter($("#reset-button"));
      }

      $(".rearrangement-step-input").last().removeClass("is-invalid");

      $(".arithmetic-operation-select").last().attr("readonly", true);
      $(".rearrangement-step-input").last().attr("readonly", true);
      $(".rearrangement-button").last().attr("disabled", true);

      var newLeftEquationPart = window.performRearrangementStep(
        leftEquationPart,
        arithmeticOperation,
        rearrangementStep
      );

      var newRightEquationPart = window.performRearrangementStep(
        rightEquationPart,
        arithmeticOperation,
        rearrangementStep
      );

      $('[data-toggle="tooltip"]').tooltip("hide");

      $("#equation-rearrangement-div").append(
        RearrangementTemplate({
          leftEquationPart: newLeftEquationPart,
          rightEquationPart: newRightEquationPart
        })
      );

      if ($("#help-button").text().trim() == "Hilfe ausschalten") {
        $('[data-toggle="tooltip"]').tooltip("enable");
      }

      if (
        window.isFinalEquation(
          newLeftEquationPart,
          newRightEquationPart,
          variable
        )
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
            text: "Die Gleichung wurde erfolgreich umgeformt.",
            alertType: "success"
          })
        );

        window.generateRearrangementStepsArray(newLeftEquationPart, newRightEquationPart);
      } else {
        // Rearrangement step was evaluated successfully | generating feedback
        $("#advice-button").last().attr("disabled", window.checkIfEquationContainsRootOrPower(newLeftEquationPart, newRightEquationPart));

        const feedbackMessage = window.generateFeedbackMessage(
          leftEquationPart,
          rightEquationPart,
          variable,
          arithmeticOperation,
          rearrangementStep
        );

        // Generate new rearrangementSteps array
        window.generateRearrangementStepsArray(newLeftEquationPart, newRightEquationPart);

        if (!jQuery.isEmptyObject(feedbackMessage)) {
          $("#alert-div").append(
            AlertTemplate({
              text: feedbackMessage.message,
              alertType: feedbackMessage.type
            })
          );
        }
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

    event.preventDefault();
  });

  /* restart button functionality */
  $(document).on("click", "#restart-button", function (event) {
    window.resetWrongCounter();
    $("#alert-div").empty();

    $(".equation-rearrangement-step-div").remove();
    $("#left-equation-input").attr("readonly", false);
    $("#right-equation-input").attr("readonly", false);
    $("#variable-input").attr("readonly", false);
    $("#left-equation-input").val("");
    $("#right-equation-input").val("");
    $("#variable-input").val("");
    $("#left-equation-input").focus();

    $('[data-toggle="tooltip"]').tooltip("hide");

    $("#restart-button").replaceWith(StartButtonTemplate);
    $("#reset-button").remove();
    $("#advice-button").remove();

    if ($("#help-button").text().trim() == "Hilfe ausschalten") {
      $('[data-toggle="tooltip"]').tooltip("enable");
    }

    event.preventDefault();
  });

  $(document).on("click", "#help-button", function (event) {
    if ($("#help-button").text().trim() == "Hilfe ausschalten") {
      $("#help-button").text("Hilfe einschalten");
      $('[data-toggle="tooltip"]').tooltip("hide");
      $('[data-toggle="tooltip"]').tooltip("disable");
    } else {
      $("#help-button").text("Hilfe ausschalten");
      $('[data-toggle="tooltip"]').tooltip("enable");
    }

    event.preventDefault();
  });

  $(document).on("click", "#reset-button", function (event) {
    $("#alert-div").empty();
    if (window.getLastOperationsLength() === 0) {
      $("#alert-div").empty();
      $("#alert-div").append(
        AlertTemplate({
          text: "Es kann nichts rückgängig gemacht werden.",
          alertType: "danger"
        })
      );
    } else {
      let parentElement = $("#equation-rearrangement-div")[0];
      parentElement.lastElementChild.remove();
      $(".arithmetic-operation-select").last().attr("readonly", false);
      $(".rearrangement-step-input").last().attr("readonly", false);
      $(".rearrangement-button").last().attr("disabled", false);

      let leftSide = parentElement.lastElementChild.children[0].children[0].value;
      let rightSide = parentElement.lastElementChild.children[0].children[2].value;
      window.generateRearrangementStepsArray(leftSide, rightSide);
      window.resetLastOperation();
    }
    event.preventDefault();
  });

  $(document).on("click", "#advice-button", function (event) {
    const alertDiv = $("#alert-div");

    if (alertDiv[0].children.length > 1) {
      alertDiv[0].lastElementChild.remove();
    }

    alertDiv.append(
      AlertTemplate({
        text: window.getAdviceMessage(),
        alertType: "warning"
      })
    );

    event.preventDefault();
  });
});
