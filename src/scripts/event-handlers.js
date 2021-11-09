const RearrangeEquationTemplate = ({ leftEquationPart, rightEquationPart }) => `
  <form id="rearrange-form">
    <div class="row form-group justify-content-center">
      <!-- inputs for defining the rearranged equation -->
      <input
        id="equation-guide-left-rearrange-input"
        class="
          form-control
          equation-guide-input
          equation-guide-equation-part-input
          mr-2
          text-center
        "
        value="${leftEquationPart}"
        type="text"
        readonly
      />

      <input
        id="equation-guide-equals-sign-input"
        class="
          form-control
          equation-guide-input
          text-center
          font-weight-bold
        "
        type="text"
        value="="
        readonly
      />

      <input
        class="
          form-control
          equation-guide-input
          equation-guide-equation-part-input
          ml-2
          text-center
        "
        value="${rightEquationPart}"
        type="text"
        readonly
      />

      <!-- dropdown for selecting the arithmetic operation -->
      <select
        id="equation-guide-select"
        class="bootstrap-select form-control equation-guide-input ml-2"
      >
        <option value="add" selected="selected">+</option>
        <option value="sub">-</option>
        <option value="mul">*</option>
        <option value="div">/</option>
      </select>

      <!-- rearrangement step -->
      <input
        class="
          form-control
          equation-guide-input
          equation-guide-rearrangement-step-input
          ml-2
          text-center
        "
        type="text"
        placeholder="Umformungsschritt"
        required
      />

      <!-- rearrangement button -->
      <button
        id="equation-guide-rearrange-button"
        class="btn btn-success equation-guide-button ml-2"
        type="submit"
      >
        Umformen
      </button>
    </div>
  </form>
`;

$(document).ready(function () {
  $("#start-form").on("submit", function(event) {
    // Validieren

    $(".equation-guide-equation-part-input").prop("readonly", true);

    $("#equation-rearrangement").append(
      RearrangeEquationTemplate(
        {leftEquationPart: "test", rightEquationPart: "test"}
      )
    );

    $("#start-button").replaceWith(
      $("#restart-button-template").html()
    );

    event.preventDefault();
  });
});
