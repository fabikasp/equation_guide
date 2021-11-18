RearrangementTemplate = ({ leftEquationPart, rightEquationPart }) => `
  <div class="equation-rearrangement-step-div">
    <div class="row form-group justify-content-center">
      <!-- inputs for defining the rearranged equation -->
      <input
        class="
          form-control
          equation-input
          w-25
          mr-2
          text-center
          left-rearrangement-input
        "
        value="${leftEquationPart}"
        type="text"
        readonly
      />

      <input
        class="
          form-control
          equation-input
          text-center
          font-weight-bold
          equals-sign-input
        "
        type="text"
        value="="
        readonly
      />

      <input
        class="
          form-control
          equation-input
          w-25
          ml-2
          text-center
          right-rearrangement-input
        "
        value="${rightEquationPart}"
        type="text"
        readonly
      />

      <!-- dropdown for selecting the arithmetic operation -->
      <select
        class="
          bootstrap-select
          form-control
          equation-input
          ml-2
          arithmetic-operation-select
        "
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
          equation-input
          rearrangement-step-input
          ml-2
          text-center
        "
        type="text"
        placeholder="Umformungsschritt"
        required
      />

      <!-- rearrangement button -->
      <button
        class="btn btn-success equation-guide-button rearrangement-button ml-2"
      >
        Umformen
      </button>
    </div>
  </div>
`;

StartButtonTemplate = `
  <button
    id="start-button"
    class="btn btn-primary equation-guide-button"
  >
    Start
  </button>
`;

RestartButtonTemplate = `
  <button
    id="restart-button"
    class="btn btn-primary equation-guide-button"
  >
    Neustart
  </button>
`;

AlertTemplate = ({ text, alertType }) => `
  <div class="alert alert-${alertType} w-50 mx-auto">${text}</div>
`;
