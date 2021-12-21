$(document).ready(function () {
  $(StartButtonTemplate).insertBefore($("#help-button"));

  $('[data-toggle="tooltip"]').tooltip("enable");

  $("#left-equation-input").focus();

  /* start button functionality */
  $(document).on("click", "#start-button", function (event) {
    let leftEquationPart = $("#left-equation-input").val().toString().trim();
    let rightEquationPart = $("#right-equation-input").val().toString().trim();
    let variable = $("#variable-input").val().toString().trim();

    $("#alert-div").empty();

    // Change , to . so mathsteps/nerdamer can handle it
    leftEquationPart = leftEquationPart.replace(/[,]/g, '.');
    rightEquationPart = rightEquationPart.replace(/[,]/g, '.');

    let startEquationEvaluation = window.evaluateStartEquation(
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

      window.generateRearrangementStepsArray(leftEquationPart.replace(/[,]/g, '.'), rightEquationPart.replace(/[,]/g, '.'), variable);

      // Change . to , to display it properly
      leftEquationPart = leftEquationPart.replace(/[.]/g, ',');
      rightEquationPart = rightEquationPart.replace(/[.]/g, ',');

      $("#alert-div").empty();
      $(".equation-input").attr("readonly", true);

      $("#equation-rearrangement-div").append(
        RearrangementTemplate({
          leftEquationPart: startEquationEvaluation.leftEquationPart,
          rightEquationPart: startEquationEvaluation.rightEquationPart
        })
      );

      $('[data-toggle="tooltip"]').tooltip("hide");

      $("#start-button").replaceWith(RestartButtonTemplate);

      if ($("#help-button").text().trim() === "Hilfe ausschalten") {
        $('[data-toggle="tooltip"]').tooltip("enable");
      }
    }

    event.preventDefault();
  });

  $(document).on("input", ".arithmetic-operation-select", function (event) {
    let arithmeticOperation = $(".arithmetic-operation-select option:selected").last().val().toString();

    disableRearrangementStep = ["^2", "sqrt"].includes(arithmeticOperation);

    $(".rearrangement-step-input").last().attr("readonly", disableRearrangementStep);

    if (disableRearrangementStep) {
      $(".rearrangement-step-input").last().val("");
    }

    event.preventDefault();
  });

  $(document).on("input", ".rearrangement-step-input", function (event) {
    let rearrangementStep = $(".rearrangement-step-input").last().val().toString().trim();

    if (rearrangementStep != "" && ["+", "-", "*", "/"].includes(rearrangementStep[0])) {
      $(".arithmetic-operation-select").last().val(rearrangementStep[0]);
      $(".rearrangement-step-input").last().val(rearrangementStep.substring(1));
    }

    event.preventDefault();
  });

  /* rearrangement button functionality */
  $(document).on("click", ".rearrangement-button", function (event) {
    let leftEquationPart = $(".left-rearrangement-input").last().val().toString().trim();
    let rightEquationPart = $(".right-rearrangement-input").last().val().toString().trim();
    let arithmeticOperation = $(".arithmetic-operation-select option:selected").last().val().toString();
    let rearrangementStep = $(".rearrangement-step-input").last().val().toString().trim();
    let variable = $("#variable-input").val().toString().trim();

    $("#alert-div").empty();

    let rearrangementStepEvaluation = window.evaluateRearrangementStep(
      leftEquationPart,
      rightEquationPart,
      arithmeticOperation,
      rearrangementStep
    );

    if (rearrangementStepEvaluation === "") {
      if (
        $(".left-rearrangement-input").length > 0
        && $("#reset-button").length === 0
      ) {
        $(ResetButtonTemplate).insertAfter($("#restart-button"));
      }

      $(".rearrangement-step-input").last().removeClass("is-invalid");

      $(".arithmetic-operation-select").last().attr("readonly", true);
      $(".rearrangement-step-input").last().attr("readonly", true);
      $(".rearrangement-button").last().attr("disabled", true);

      // Change , to . so mathsteps/nerdamer can handle it
      leftEquationPart = leftEquationPart.replace(/[,]/g, '.');
      rightEquationPart = rightEquationPart.replace(/[,]/g, '.');
      rearrangementStep = rearrangementStep.replace(/[,]/g, '.');

      let newLeftEquationPart = window.performRearrangementStep(
        leftEquationPart,
        arithmeticOperation,
        rearrangementStep
      );

      let newRightEquationPart = window.performRearrangementStep(
        rightEquationPart,
        arithmeticOperation,
        rearrangementStep
      );

      $('[data-toggle="tooltip"]').tooltip("hide");

      // Change . back to , to display it properly
      newLeftEquationPart = newLeftEquationPart.replace(/[.]/g, ',');
      newRightEquationPart = newRightEquationPart.replace(/[.]/g, ',');

      $("#equation-rearrangement-div").append(
        RearrangementTemplate({
          leftEquationPart: newLeftEquationPart,
          rightEquationPart: newRightEquationPart
        })
      );

      if ($("#help-button").text().trim() === "Hilfe ausschalten") {
        $('[data-toggle="tooltip"]').tooltip("enable");
      }

      if (
        window.isFinalEquation(
          newLeftEquationPart,
          newRightEquationPart,
          variable
        )
      ) {
        dissolvedEquation = window.dissolveAbs(newLeftEquationPart, newRightEquationPart, variable);

        $(".left-rearrangement-input").last().removeClass("w-25").width("38.7%");
        $(".right-rearrangement-input").last().removeClass("w-25").width("38.7%");
        $(".left-rearrangement-input").last().val(dissolvedEquation.leftEquationPart);
        $(".right-rearrangement-input").last().val(dissolvedEquation.rightEquationPart);

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

        window.generateRearrangementStepsArray(newLeftEquationPart.replace(/[,]/g, '.'), newRightEquationPart.replace(/[,]/g, '.'), variable);
      } else {
       const feedbackMessage = window.generateFeedbackMessage(
          leftEquationPart,
          rightEquationPart,
          variable,
          arithmeticOperation,
          rearrangementStep
        );

        // Generate new rearrangementSteps array
        window.generateRearrangementStepsArray(newLeftEquationPart.replace(/[,]/g, '.'), newRightEquationPart.replace(/[,]/g, '.'), variable);

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
    window.resetAdviceButtonClickCounter();

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

    if ($("#help-button").text().trim() === "Hilfe ausschalten") {
      $('[data-toggle="tooltip"]').tooltip("enable");
    }

    event.preventDefault();
  });

  $(document).on("click", "#help-button", function (event) {
    if ($("#help-button").text().trim() === "Hilfe ausschalten") {
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
      let variable = $("#variable-input")[0].value;
      window.generateRearrangementStepsArray(leftSide.replace(/[,]/g, '.'), rightSide.replace(/[,]/g, '.'), variable);
      window.resetLastOperation();
    }
    event.preventDefault();
  });

  $(document).on("click", "#advice-button", function (event) {
    let leftEquationPart = $('.left-rearrangement-input').last().val().toString().trim();
    let rightEquationPart = $('.right-rearrangement-input').last().val().toString().trim();

    const alertDiv = $("#alert-div");

    if (alertDiv[0].lastElementChild !== null) {
      if (alertDiv[0].lastElementChild.classList.contains("advice")) {
        alertDiv[0].lastElementChild.remove();
      }
    }

    alertDiv.append(
      AlertTemplate({
        text: window.getAdviceMessage(leftEquationPart, rightEquationPart),
        alertType: "primary",
      })
    );

    alertDiv[0].lastElementChild.classList.add("advice");

    event.preventDefault();
  });
});
