$(document).ready(function () {
  $("#start-form").on("submit", function(event) {
    // Validieren

    $(".equation-guide-equation-part-input").prop("readonly", true);

    $("#equation-rearrangement").append(
      $("#equation-rearrangement-template").html()
    );

    $("#start-button").replaceWith(
      $("#restart-button-template").html()
    );

    event.preventDefault();
  });
});
