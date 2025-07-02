import { light } from '@shoelace-style/shoelace/dist/themes/light.styles.js';
import { css } from 'lit';
export default css`
  ${light}

  :root,
  :host,
  .sl-theme-light {
    --sl-font-sans: 'Roboto', 'Helvetica Neue';

    /* The following colors are set via app-configuration:
        --sl-color-primary
        --sl-color-primary-text
        --sl-color-secondary
        --sl-color-secondary-text
      */

    --sl-color-primary-50: var(--sl-color-primary);
    --sl-color-primary-100: var(--sl-color-primary);
    --sl-color-primary-200: var(--sl-color-primary);
    --sl-color-primary-300: var(--sl-color-primary);
    --sl-color-primary-400: var(--sl-color-primary);
    --sl-color-primary-500: var(--sl-color-primary);
    --sl-color-primary-600: var(--sl-color-primary);
    --sl-color-primary-700: var(--sl-color-primary);
    --sl-color-primary-800: var(--sl-color-primary);
    --sl-color-primary-900: var(--sl-color-primary);

    /* --sl-color-secondary set via app-configuration */
    --sl-color-secondary: var(--primary-color);
    --sl-color-secondary-50: var(--sl-color-secondary);
    --sl-color-secondary-100: var(--sl-color-secondary);
    --sl-color-secondary-200: var(--sl-color-secondary);
    --sl-color-secondary-300: var(--sl-color-secondary);
    --sl-color-secondary-400: var(--sl-color-secondary);
    --sl-color-secondary-500: var(--sl-color-secondary);
    --sl-color-secondary-600: var(--sl-color-secondary);
    --sl-color-secondary-700: var(--sl-color-secondary);
    --sl-color-secondary-800: var(--sl-color-secondary);
    --sl-color-secondary-900: var(--sl-color-secondary);

    /* Katapult Brand Grey Palletized via https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors */
    --sl-color-neutral-50: #f9faf9;
    --sl-color-neutral-100: #f3f4f3;
    --sl-color-neutral-200: #ebeceb;
    --sl-color-neutral-300: #dcdddc;
    --sl-color-neutral-400: #b9bab9;
    --sl-color-neutral-500: #9a9b9a;
    --sl-color-neutral-600: #717271;
    --sl-color-neutral-700: #5d5e5d;
    --sl-color-neutral-800: #3e3f3e;
    --sl-color-neutral-900: #1e1f1e;
    --sl-color-neutral: var(--sl-color-neutral-600);

    /* Google Material Green */
    --sl-color-success-50: #f1f8e9;
    --sl-color-success-100: #dcedc8;
    --sl-color-success-200: #c5e1a5;
    --sl-color-success-300: #aed581;
    --sl-color-success-400: #9ccc65;
    --sl-color-success-500: #8bc34a;
    --sl-color-success-600: #7cb342;
    --sl-color-success-700: #689f38;
    --sl-color-success-800: #558b2f;
    --sl-color-success-900: #33691e;
    --sl-color-success: var(--sl-color-success-500);

    /* Google Material Amber */
    --sl-color-warning-50: #fff8e1;
    --sl-color-warning-100: #ffecb3;
    --sl-color-warning-200: #ffe082;
    --sl-color-warning-300: #ffd54f;
    --sl-color-warning-400: #ffca28;
    --sl-color-warning-500: #ffc107;
    --sl-color-warning-600: #ffb300;
    --sl-color-warning-700: #ffa000;
    --sl-color-warning-800: #ff8f00;
    --sl-color-warning-900: #ff6f00;
    --sl-color-warning: var(--sl-color-warning-500);

    /* Google Material Red */
    --sl-color-danger-50: #ffebee;
    --sl-color-danger-100: #ffcdd2;
    --sl-color-danger-200: #ef9a9a;
    --sl-color-danger-300: #e57373;
    --sl-color-danger-400: #ef5350;
    --sl-color-danger-500: #f44336;
    --sl-color-danger-600: #e53935;
    --sl-color-danger-700: #d32f2f;
    --sl-color-danger-800: #c62828;
    --sl-color-danger-900: #b71c1c;
    --sl-color-danger: var(--sl-color-danger-500);
  }
  .sl-toast-stack {
    top: 3.5rem;
  }
  sl-button[variant='default']:not([disabled]):hover::part(base) {
    background-color: var(--sl-color-neutral-0);
  }
  /* SlSelect Material Style */
  sl-select[look-like-paper-element]::part(combobox) {
    border: none;
    --sl-input-placeholder-color: var(--sl-color-neutral-600);
    --sl-focus-ring-width: 0;
    background: none;
  }
  sl-select[look-like-paper-element]::part(expand-icon) {
    height: 0;
    width: 0;
    border-top: 5px solid var(--sl-color-primary);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
  sl-dropdown[look-like-paper-element] sl-button::part(base) {
    border: none;
    --sl-input-placeholder-color: var(--sl-color-neutral-600);
    --sl-focus-ring-width: 0;
    background: none;
    font-size: 16px;
    color: var(--primary-text-color);
    font-weight: normal;
  }
  sl-dropdown[look-like-paper-element] sl-button::part(caret) {
    align-self: center;
    height: 0;
    width: 0;
    border-top: 5px solid var(--sl-color-primary);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
  /* SlInput Material Style */
  sl-input[look-like-paper-element]::part(base) {
    border: none;
    --sl-focus-ring-width: 0;
  }
  sl-input[look-like-paper-element]::part(input) {
    border-bottom: var(--sl-input-paper-border-bottom-width, 1px) solid var(--sl-color-neutral-900);
  }
  sl-input[look-like-paper-element]::part(input):focus {
    border-bottom: 2px solid var(--sl-color-primary);
  }
  /* Katapult Drop Down Material Style */
  katapult-dropdown[look-like-paper-element]::part(expand-icon) {
    height: 0;
    width: 0;
    border-top: 5px solid var(--sl-color-primary);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
`;
