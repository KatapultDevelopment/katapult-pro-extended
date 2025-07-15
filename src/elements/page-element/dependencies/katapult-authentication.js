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
import { KatapultShoelace } from '../../../styles/katapult-shoelace.js';
import { KatapultFlex } from '../../../styles/katapult-flex.js';

export class KatapultAuthentication extends LitElement {
  static properties = {
    _validApiKey: {type: Boolean, state: true},
    _apiError: {type: Boolean, state: true},
    _saveApiData: {type: Boolean}
  }
  static styles = [
    unsafeCSS(KatapultShoelace),
    unsafeCSS(KatapultFlex),
    css`
      #loginForm::part(panel) {
        max-width: 335px;
      }
      #loginForm::part(body) {
        padding-bottom: 8px;
      }
      .link {
        color: var(--primary-color, blue);
        text-decoration: underline;
        cursor: pointer;
      }
      .helpText {
        color: var(--sl-color-gray-600);
        text-align: center;
        font-size: 14px;
      }
    `
  ]
  render() {
    return html`
      <!-- Api key needs to be entered, or was invalid when entered -->
      <sl-dialog id="loginForm" no-header .open=${!this._validApiKey} @sl-request-close=${(e) => e.preventDefault()}>
        <sl-input
          id="apiServerInput"
          clearable
          autofocus
          placeholder="Enter server code"
          label="API Server"
          style="margin-bottom: 12px;"
        >
          <sl-icon small library="material" slot="clear-icon" name="clear"></sl-icon>
        </sl-input>
        <sl-input
          id="apiKeyInput"
          type="password"
          password-toggle
          clearable
          placeholder="Enter user API"
          label="API Key"
        >
          <sl-icon small library="material" slot="clear-icon" name="clear"></sl-icon>
          <sl-icon small library="material" slot="show-password-icon" name="visibility_off_round"></sl-icon>
          <sl-icon small library="material" slot="hide-password-icon" name="visibility_round"></sl-icon>
        </sl-input>
        <sl-checkbox id="rememberMe" size="small" @sl-change=${(e) => this._saveApiData = e.currentTarget.checked} style="margin-top: 12px; color: var(--sl-color-gray-600);">Remember device for 30 days</sl-checkbox>
        <div flex column slot="footer">
          <sl-button variant="primary" @click=${() => this.#checkAPI()}>Open API Tool</sl-button>
          <p class="helpText" style="margin-bottom: 0; margin-top: 24px;">
            If you don't know how to access your API key, follow along with
            <span class="link"
              @click=${() => this.#openAPIPage()}>this</span
            >
            documentation.
          </p>
          <p class="helpText" style="margin-bottom: 2px;">The server code is the text in your Katapult Pro url, found between <span style="color: var(--primary-color, blue);">https://</span> and <span style="color: var(--primary-color, blue);">katapultpro.com</span>. If there is nothing there, leave the input empty.</p>
          ${when(
            this._apiError,
            () => html`
              <p style="color: red; font-size: 14px; text-align: center; margin-top: 12px; margin-bottom: 2px;">
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

    // Delete api from local storage if expired
    const now = new Date();
    const apiLocal = JSON.parse(localStorage.getItem('apiKey'));
    if(now >= apiLocal?.expiry) localStorage.removeItem('apiKey');

    // Variables
    this._validApiKey = JSON.parse(localStorage.getItem('apiKey'))?.data ? true : false;
    this._apiError = false;
    if(this._validApiKey) this.requestUpdate();

    // Functions and Events
    window.addEventListener('apiChange', async (e) => {
      if (!e.detail?.key) {
        this._validApiKey = false;
        this.shadowRoot.getElementById('rememberMe').checked = false;
        this.shadowRoot.getElementById('apiKeyInput').value = '';
        this.shadowRoot.getElementById('apiServerInput').value = '';
        this.requestUpdate();
      }
    });
  }
  #openAPIPage() {
    window.open('https://github.com/KatapultDevelopment/katapult-pro-api-documentation/blob/main/v2/DocumentationV2.MD#api-key-generation', '_blank');
  }
  async #checkAPI() {
    const apiKey = this.shadowRoot.getElementById('apiKeyInput')?.value;
    const apiServer = this.shadowRoot.getElementById('apiServerInput')?.value || '';
    if (apiKey) {
      const data = await this.#retrieveWelcomeMessage(apiKey, apiServer);
      if (data?.error == 'INVALID API KEY') {
        this._apiError = true;
      }
      else {
        if(this._saveApiData) {
          // Calculate 30 days from now
          const now = new Date();
          const expiryTime = now.getTime() + (30 * 24 * 60 * 60 * 1000);

          localStorage.setItem('apiKey', JSON.stringify({data: apiKey, expiry: expiryTime}));
          localStorage.setItem('db', JSON.stringify({data: apiServer, expiry: expiryTime}));
        }
        window.dispatchEvent(new CustomEvent('apiChange', { detail: {key: apiKey, db: apiServer} }));
        this._validApiKey = true;
      }
      this.requestUpdate();
    }
  }
  async #retrieveWelcomeMessage(apiKey, apiServer) {
    if (apiKey) {
      const database = apiServer ? apiServer + '.' : '';
      const fetchData = await fetch(`https://${database}katapultpro.com/api/v2?api_key=${apiKey}`, {
        method: 'GET'
      }).then((res) => res.json());
      return fetchData;
    }
  }
}
window.customElements.define('katapult-authentication', KatapultAuthentication);
