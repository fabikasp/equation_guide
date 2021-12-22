RearrangementTemplate = ({ leftEquationPart, rightEquationPart }) => `
  <div class="equation-rearrangement-step-div">
    <div class="row form-group justify-content-center">
      <!-- inputs for defining the rearranged equation -->
      <input
        class="
          form-control
          equation-input
          m-2
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
          m-2
        "
        type="text"
        value="="
        readonly
      />

      <input
        class="
          form-control
          equation-input
          m-2
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
          m-2
          arithmetic-operation-select
        "
        data-toggle="tooltip"
        data-placement="top"
        title="
          Legt die Rechenoperation fest, die auf
          die Gleichung angewendet werden soll.
        "
      >
        <option value="+" selected="selected">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
        <option value="^2">^2</option>
        <option value="sqrt">sqrt</option>
      </select>

      <!-- rearrangement step -->
      <input
        class="
          form-control
          equation-input
          rearrangement-step-input
          m-2
          text-center
        "
        type="text"
        placeholder="Umformungsschritt"
        data-toggle="tooltip"
        data-placement="top"
        title="
          Legt den mathematischen Ausdruck fest, der auf beiden Seiten
          der Gleichung addiert, subtrahiert, multipliziert oder
          dividiert wird. Negative Werte müssen in Klammern geschrieben
          werden.
        "
        required
      />

      <!-- rearrangement button -->
      <button
        class="btn btn-success rearrangement-button"
        data-toggle="tooltip"
        data-placement="top"
        title="
          Wendet den angegebenen Umformungsschritt mit der entsprechenden
          Rechenoperation auf die Gleichung an.
        "
      >
        Umformen
      </button>
    </div>
  </div>
`;

StartButtonTemplate = `
  <button
    id="start-button"
    class="btn btn-primary equation-guide-button m-2"
    data-toggle="tooltip"
    data-placement="bottom"
    title="
      Prüft und vereinfacht die eingegebene Gleichung
      und startet den Lösungsprozess.
    "
  >
    Start
  </button>
`;

RestartButtonTemplate = `
  <button
    id="restart-button"
    class="btn btn-primary equation-guide-button m-2"
    data-toggle="tooltip"
    data-placement="bottom"
    title="
      Bricht den aktuellen Lösungsprozess ab und
      stellt den Ausgangszustand wieder her.
    "
  >
    Neustart
  </button>
`;

ResetButtonTemplate = `
  <a
    id="reset-button"
    class="btn btn-dark equation-guide-button m-2"
    href="#"
    data-toggle="tooltip"
    data-placement="bottom"
    title="
      Setzt die Gleichung um einen Umformungsschritt zurück.
    "
  >
    Zurücksetzen
  </a>
`

AdviceButtonTemplate = `
  <button
    id="advice-button"
    class="btn btn-success equation-guide-button advice-button m-2"
    href="#"
    data-toggle="tooltip"
    data-placement="bottom"
    title="
      Gibt dir einen zufälligen Tipp, falls du nicht weiter kommst.
    "
  >
    Tipp
  </button>
`

AlertTemplate = ({ text, alertType }) => `
  <div class="alert alert-${alertType} w-50 mx-auto">${text}</div>
`;
