// Polymer
import '@polymer/font-roboto/roboto.js';
import '@polymer/paper-styles/color.js';

// Lit
import {LitElement, html, css, unsafeCSS} from 'lit';
import { when } from 'lit/directives/when.js';

// Styles
import { KatapultShoelace } from '../../styles/katapult-shoelace.js';

// Elements
import '../katapult-job-dialog.js';
import '../katapult-toolbar.js';
import '../katapult-authentication.js';
import '../katapult-warning.js';
import '../katapult-dropdown.js';
import '../katapult-job-dropdown.js';

// Shoelace Icons
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';

// Shoelace Animations
import { setDefaultAnimation } from '@shoelace-style/shoelace/dist/utilities/animation-registry.js';

export class KatapultPageElement extends LitElement {
  static properties = {
    supportNum: {type: String},
    supportEmail: {type: String},
    companyName: {type: String},
    logoLink: {type: String},
    includeToolbarJobPicker: {type: Boolean}
  }
  static styles = [
    unsafeCSS(KatapultShoelace),
    css`
      :root {
        --sl-input-focus-ring-color: none;
      }
      :host {
        font-family: Roboto !important;
        display: flex;
      }
      * {
        font-family: Roboto !important;
      }
      body {
        height: 100vh;
        margin: 0;
      }
      main {
        height: 100%;
        width: 100%;
        background: var(--sl-color-gray-50);
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 1;
        filter: blur(0px);
        transition:
          opacity 0.3s,
          filter 0.3s;
        pointer-events: auto;
      }
    `
  ]
  render() {
    return html`
    <!doctype html>
    <html lang="en">
    <head>
      <title>Extension Page</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes" />
      <meta name="robots" content="noindex" />
      <!-- Material Icons -->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <!-- Material Symbols -->
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />
      <!-- Shoelace -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css" />
      <meta name="theme-color" content="#003E51" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace-autoloader.js"></script>
    </head>
    <body>
      <katapult-authentication>
        <main>
          <katapult-toolbar
            .supportNum=${this.supportNum}
            .supportEmail=${this.supportEmail}
            .companyName=${this.companyName}
            .logoLink=${this.logoLink}
          >
            ${when(
              this.includeToolbarJobPicker,
              () => html`<katapult-job-dropdown slot="left"><katapult-job-dropdown></katapult-job-dropdown>`
            )}
          </katapult-toolbar>
          <slot></slot>
        </main>
      </katapult-authentication>
    </body>
    `
  }
  constructor() {
    super();

    // Variables
    this.supportNum = '';
    this.supportEmail = '';
    this.companyName = '';
    this.logoLink = '';
    this.includeToolbarJobPicker = false;

    // Shoelace icon support
    registerIconLibrary('material', {
      resolver: (name) => {
        const match = name.match(/^(.*?)(_(round|sharp))?$/);
        return `https://material-icons.github.io/material-icons/svg/${match[1]}/${match[3] || 'outline'}.svg`;
      },
      mutator: (svg) => svg.setAttribute('fill', 'currentColor')
    });

    // Change the default animation for all dialogs
    setDefaultAnimation('dropdown.hide', {
      keyframes: [
        { opacity: '0' },
        { opacity: '0' }
      ],
      options: {
        duration: 100
      }
    });
    setDefaultAnimation('dropdown.show', {
      keyframes: [
        { opacity: '1' },
        { opacity: '1' }
      ],
      options: {
        duration: 100
      }
    });
  }
}
window.customElements.define('katapult-page-element', KatapultPageElement);
