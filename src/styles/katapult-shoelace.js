const $_documentContainer = document.createElement('template');

export const KatapultShoelace = `
// Default styles for the elements
    :host {
        --header-spacing: 16px !important;
        --body-spacing: 8px 16px !important;
        --footer-spacing: 16px !important;
    }
    sl-dialog::part(panel) {
        border-radius: 16px;
    }
    sl-dialog::part(body), sl-dialog::part(footer), sl-dialog::part(title) {
        padding: 16px;
    }
    sl-button::part(label) {
        font-family: Roboto;
        font-size: 16px;
        font-weight: normal;
        color: var(--sl-color-gray-500);
    }
    sl-button::part(base) {
        border-radius: 16px !important;
        border-color: var(--sl-color-gray-200);
    }
    sl-input::part(base) {
        box-shadow: none !important;
        font-family: Roboto;
        outline: none;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid var(--sl-color-gray-500);
    }
    sl-input::part(form-control-label) {
        font-size: 12px;
    }
    sl-input::part(password-toggle-button),
    sl-input::part(clear-button) {
        width: fit-content;
        padding: 0 4px;
    }
    sl-icon {
        color: var(--primary-color, var(--sl-color-gray-700));
        font-size: 24px;
    }
    sl-icon-button::part(base) {
        color: var(--primary-color, var(--sl-color-gray-700));
        font-size: 24px;
    }
    sl-icon-button::part(base):hover {
        color: var(--secondary-color, black) !important;
    }
    sl-avatar {
        --size: 30px;
    }
    sl-menu {
        border: none;
        border-radius: 16px;
    }
    sl-icon-button::part(base) {
        padding: 0;
    }
    sl-dropdown::part(panel) {
        background: white;
        border-radius: 16px;
    }
    sl-alert sl-icon {
        color: var(--accent-color, red);
    }
    sl-alert::part(base) {
        border-top-color: var(--accent-color, red);
    }

// Attribute styles
    sl-dialog[no-x]::part(close-button) {
        display: none;
    }
    sl-dialog[no-actions]::part(header-actions) {
        display: none;
    }
    sl-dialog[filled]::part(header) {
        color: white;
        border-radius: 16px 16px 0 0;
        background: var(--primary-color, var(--sl-color-gray-500));
    }
    sl-dialog[filled]::part(title) {
        color: white;
        border-radius: 16px 16px 0 0;
        background: var(--primary-color, var(--sl-color-gray-500));
    }
    sl-dialog[centered]::part(header) {
        text-align: center;
    }
// Primary Buttons
    sl-button[variant='primary'] {
        background-color: var(--primary-color, var(--sl-color-gray-500));
    }
    sl-button[variant='primary']::part(label) {
        color: white;
    }
    sl-button[variant='primary']::part(base) {
        background-color: var(--primary-color, var(--sl-color-gray-500));
    }
    sl-button[variant='primary']::part(base):hover {
        background-color: var(--secondary-color, var(--sl-color-gray-600));
        border-color: var(--secondary-color, var(--sl-color-gray-600));
        color: var(--primary-color, var(--sl-color-gray-600));
    }
    sl-button[variant='primary']:hover {
        color: var(--primary-color, var(--sl-color-gray-600));
    }
// Default Buttons
    sl-button[variant='default']::part(base) {
        background: white !important;
    }
    sl-button[variant='default']::part(base):hover {
        border-color: var(--primary-color, var(--sl-color-gray-400));
        color: var(--primary-color, var(--sl-color-gray-600));
        background: var(--sl-color-gray-50);
    }
    sl-button[variant='default'] {
        color: var(--sl-color-gray-400);
    }
    sl-button[variant='default']:hover {
        color: var(--primary-color, var(--sl-color-gray-600));
    }
    sl-button[variant='default']::part(label) {
        color: var(--sl-color-gray-600);
    }
    sl-button[variant='default']::part(label):hover {
        color: var(--primary-color, var(--sl-color-gray-600));
    }
    sl-icon[small] {
        font-size: 20px;
    }
    sl-icon[nine-dot] {
        font-size: 30px;
    }
`;

$_documentContainer.innerHTML = `<dom-module id="katapult-shoelace">
  <template>
    <style>
      ${KatapultShoelace}
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
