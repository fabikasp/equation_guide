$(document).ready(function () {
  $("#start-form").on("submit", function(event) {
    // Validieren

    $(".equation-guide-equation-part-input").prop("readonly", true);

    $("#equation-rearrangement").append("<p>Test</p>");

    event.preventDefault();
  });
});
