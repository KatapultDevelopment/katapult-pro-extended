// Lit
import {LitElement, html, css, unsafeCSS} from 'lit';
import { when } from 'lit/directives/when.js';

// Shoelace
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

// Styles
import { SlKatapultStyle } from '../styles/sl-katapult-style.js';
import { FlexStyle } from '../styles/flex.js';

export class KatapultAuthentication extends LitElement {
  static properties = {
    _validApiKey: {type: Boolean, state: true},
    _apiError: {type: Boolean, state: true},
    _currentDb: {type: String, state: true}
  }
  static styles = [
    unsafeCSS(SlKatapultStyle),
    unsafeCSS(FlexStyle),
    css`
      #loginForm::part(panel) {
        max-width: 330px;
      }
      .link {
        color: var(--primary-color, var(--sl-color-gray-500));
        text-decoration: underline;
        cursor: pointer;
      }
    `
  ]
  render() {
    return html`
      <!-- Api key needs to be entered, or was invalid when entered -->
      <sl-dialog id="loginForm" no-header .open=${!this.validApiKey} @sl-request-close=${(e) => e.preventDefault()}>
        <sl-input
          id="apiKeyInput"
          type="password"
          password-toggle
          clearable
          autofocus
          placeholder="API Key"
          label="API Key"
          help-text="Enter your API key for the selected database."
        >
          <sl-icon small library="material" slot="clear-icon" name="clear"></sl-icon>
          <sl-icon small library="material" slot="show-password-icon" name="visibility_off_round"></sl-icon>
          <sl-icon small library="material" slot="hide-password-icon" name="visibility_round"></sl-icon>
        </sl-input>
        <div flex column slot="footer">
          <sl-button variant="primary" @click=${() => this.checkAPI()}>Open API Tool</sl-button>
          <p style="color: var(--sl-color-gray-600); text-align: center; font-size: 14px; margin-bottom: 2px;">
            If you do not know how to access your API key, follow along with
            <span class="link"
              @click=${() => this.openAPIPage()}>this</span
            >
            documentation.
          </p>
          ${when(
            this.apiError,
            () => html`
              <p style="color: red; font-size: 14px; text-align: center; margin-top: 6px; margin-bottom: 2px;">
                Your API Key is invalid or is for a different database. Try again.
              </p>
            `
          )}
        </div>
      </sl-dialog>

      <!-- Api key exists and is valid -->
       ${when(
        this.validApiKey,
        () => html`
          <!-- The default slot -->
          <slot></slot>
        `
       )}
    `
  }
  constructor() {
    super();

    // Variables
    this.validApiKey = this.checkForAPI();
    this.apiError = false;
    this.currentDb = 'dcs';
    if(this.validApiKey) this.requestUpdate();
  }
  checkForAPI() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('api_key') || localStorage.getItem('apiKey') ? true : false;
  }
  openAPIPage() {
    window.open('https://github.com/KatapultDevelopment/katapult-pro-api-documentation/blob/main/v2/DocumentationV2.MD#api-key-generation', '_blank');
  }
  async checkAPI() {
    const inputVal = this.shadowRoot.getElementById('apiKeyInput')?.value;
    if (inputVal) {
      const data = await this.getJobData(inputVal);
      if (data?.error == 'INVALID API KEY') {
        this.apiError = true;
      }
      else {
        localStorage.setItem('apiKey', inputVal);
        const event = new CustomEvent('apiKeyChange', { detail: 'data-change' });
        window.dispatchEvent(event);
        this.validApiKey = true;
      }
      this.requestUpdate();
    }
  }
  async getJobData(apiKey) {
    if (apiKey) {
      const database = this.currentDb != 'database' ? this.currentDb + '.' : '';
      const fetchData = await fetch(`https://${database}katapultpro.com/api/v2?api_key=${apiKey}`, {
        method: 'GET'
      }).then((res) => res.json());
      return fetchData;
    }
  }
}
window.customElements.define('katapult-authentication', KatapultAuthentication);
