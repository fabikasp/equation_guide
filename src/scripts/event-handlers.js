$(document).ready(function () {
  $("#start-form").on("submit", function(event) {
    // Validieren

    $(".equation-guide-equation-part-input").prop("readonly", true);

    var template = "<p>Test</p>"
    // https://stackoverflow.com/questions/18673860/defining-a-html-template-to-append-using-jquery
    console.log(template)
    $("#equation-rearrangement").append(template);

    event.preventDefault();
  });
});
