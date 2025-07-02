const $_documentContainer = document.createElement('template');

export const KatapultScrollbars = `
  ::-webkit-scrollbar {
      width: 8px;
      height:8px;
      background: var(--paper-grey-200);
  }

  ::-webkit-scrollbar-track {
      /* -webkit-box-shadow: inset 0 0 3px #717271; */
  }

  ::-webkit-scrollbar-thumb {
      background: var(--paper-grey-400);
  }
`;

$_documentContainer.innerHTML = `<dom-module id="katapult-scrollbars">
  <template>
    <style>
      ${KatapultScrollbars}
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);