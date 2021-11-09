const RearrangementTemplate = ({ leftEquationPart, rightEquationPart }) => `
  <form>
    <div class="row form-group justify-content-center">
      <!-- inputs for defining the rearranged equation -->
      <input
        name="left-rearrangement-input"
        class="
          form-control
          equation-input
          w-25
          mr-2
          text-center
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
        name="right-rearrangement-input"
        class="
          form-control
          equation-input
          w-25
          ml-2
          text-center
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
        type="submit"
      >
        Umformen
      </button>
    </div>
  </form>
`;

StartButtonTemplate = `
  <button
    id="start-button"
    class="btn btn-primary equation-guide-button"
    type="submit"
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

exports = { RearrangementTemplate, StartButtonTemplate, RestartButtonTemplate };
