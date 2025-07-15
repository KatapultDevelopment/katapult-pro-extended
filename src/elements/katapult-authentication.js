// Lit
import {LitElement, html, css, unsafeCSS} from 'lit';
import { when } from 'lit/directives/when.js';

// Shoelace
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';

// Styles
import { KatapultShoelace } from '../styles/katapult-shoelace.js';
import { KatapultFlex } from '../styles/katapult-flex.js';

export class KatapultAuthentication extends LitElement {
  static properties = {
    _validApiKey: {type: Boolean, state: true},
    _apiError: {type: Boolean, state: true},
    _currentDb: {type: String, state: true},
    _saveApi:{type: Boolean}
  }
  static styles = [
    unsafeCSS(KatapultShoelace),
    unsafeCSS(KatapultFlex),
    css`
      #loginForm::part(panel) {
        max-width: 330px;
      }
      #loginForm::part(body) {
        padding-bottom: 8px;
      }
      .link {
        color: var(--primary-color, blue);
        text-decoration: underline;
        cursor: pointer;
      }
    `
  ]
  render() {
    return html`
      <!-- Api key needs to be entered, or was invalid when entered -->
      <sl-dialog id="loginForm" no-header .open=${!this._validApiKey} @sl-request-close=${(e) => e.preventDefault()}>
        <sl-input
          id="apiKeyInput"
          type="password"
          password-toggle
          clearable
          autofocus
          placeholder="Enter User API"
          label="API Key"
        >
          <sl-icon small library="material" slot="clear-icon" name="clear"></sl-icon>
          <sl-icon small library="material" slot="show-password-icon" name="visibility_off_round"></sl-icon>
          <sl-icon small library="material" slot="hide-password-icon" name="visibility_round"></sl-icon>
        </sl-input>
        <sl-checkbox size="small" @sl-change=${(e) => this.changeSaveStatus(e)} style="margin-top: 12px; color: var(--sl-color-gray-600);">Remember device</sl-checkbox>
        <div flex column slot="footer">
          <sl-button variant="primary" @click=${() => this.checkAPI()}>Open API Tool</sl-button>
          <p style="color: var(--sl-color-gray-600); text-align: center; font-size: 14px; margin-bottom: 2px;">
            If you don't know how to access your API key, follow along with
            <span class="link"
              @click=${() => this.openAPIPage()}>this</span
            >
            documentation.
          </p>
          ${when(
            this._apiError,
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
        this._validApiKey,
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
    this._validApiKey = this.checkForAPI();
    this._apiError = false;
    this._currentDb = 'dcs';
    if(this._validApiKey) this.requestUpdate();

    // Functions and Events
    window.addEventListener('apiKeyChange', async (e) => {
      this._apiKey = e.detail;
      if (!this._apiKey) {
        this._validApiKey = false;
        this.shadowRoot.getElementById('apiKeyInput').value = '';
        this.requestUpdate();
      }
    });
  }
  changeSaveStatus(e) {
    this._saveApi = e.currentTarget.checked;
  }
  checkForAPI() {
    return localStorage.getItem('apiKey') ? true : false;
  }
  openAPIPage() {
    window.open('https://github.com/KatapultDevelopment/katapult-pro-api-documentation/blob/main/v2/DocumentationV2.MD#api-key-generation', '_blank');
  }
  async checkAPI() {
    const inputVal = this.shadowRoot.getElementById('apiKeyInput')?.value;
    if (inputVal) {
      const data = await this.retrieveWelcomeMessage(inputVal);
      if (data?.error == 'INVALID API KEY') {
        this._apiError = true;
      }
      else {
        if(this._saveApi) localStorage.setItem('apiKey', inputVal);
        const event = new CustomEvent('apiKeyChange', { detail: inputVal });
        window.dispatchEvent(event);
        this._validApiKey = true;
      }
      this.requestUpdate();
    }
  }
  async retrieveWelcomeMessage(apiKey) {
    if (apiKey) {
      const database = this._currentDb ? this._currentDb + '.' : '';
      const fetchData = await fetch(`https://${database}katapultpro.com/api/v2?api_key=${apiKey}`, {
        method: 'GET'
      }).then((res) => res.json());
      return fetchData;
    }
  }
}
window.customElements.define('katapult-authentication', KatapultAuthentication);
