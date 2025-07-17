// Lit
import {LitElement, html, css, unsafeCSS} from 'lit';
import { when } from 'lit/directives/when.js';
import { map } from 'lit/directives/map.js';

// Shoelace
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

// Styles
import { KatapultShoelace } from '../../../styles/katapult-shoelace.js';
import { KatapultFlex } from '../../../styles/katapult-flex.js';

// Hashing
import 'spark-md5';

// Other
import { xorDecrypt } from './obfuscation.js';

// Registers the element
export class KatapultToolbar extends LitElement {
    static properties = {
        logoLink: {type: String},
        companyName: {type: String},
        supportNum: {type: String},
        supportEmail: {type: String},

        _pages: {type: Array, state: true},
        _email: {type: String, state: true},
        _gravatarSrc: {type: String, state: true},
        _apiKey: {type: String, state: true, reflect: true},
        _currentDb: {type: String, state: true, reflect: true}
    }

  // Styles are applied to the shadow root and scoped to this element
  static styles = [
    unsafeCSS(KatapultShoelace),
    unsafeCSS(KatapultFlex),
    css`
    :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        z-index: 4;
    }
    ::slotted([title]) {
        font-size: var(--sl-font-size-large);
        color: var(--primary-color, black);
        font-weight: var(--sl-font-weight-bold);
    }
    #toolbar {
        height: 56px;
        padding: 4px 8px 4px 16px;
        box-sizing: border-box;
        background-color: white;
        box-shadow: var(--sl-shadow-medium);
    }
    .toolbar-icon {
        padding: 6px 12px;
    }
    sl-menu-item::part(base) {
        align-items: center;
        background: none;
    }
    sl-menu-item::part(prefix) {
        margin-bottom: 5px;
    }
    #help-dropdown::part(panel) {
        max-width: 100vw;
        width: 500px;
        padding: 24px;
    }
    #nine-dot-dropdown sl-menu-item::part(checked-icon),
    #nine-dot-dropdown sl-menu-item::part(suffix),
    #nine-dot-dropdown sl-menu-item::part(submenu-icon) {
        display: none;
    }
    #nine-dot-dropdown sl-menu-item::part(base) {
        padding: 0;
        width: 78px;
        height: 78px;
        max-width: 78px;
        max-height: 78px;
        flex-direction: column;
    }
    #nine-dot-dropdown sl-menu-item::part(label) {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
    }
    #nine-dot-dropdown sl-menu-item sl-icon {
        display: flex;
        align-items: center;
        margin: auto;
    }
    #nine-dot-dropdown sl-menu-item::part(label) {
        margin: 0;
        align-items: start;
        max-height: 3em;
        white-space: normal;
        text-align: center;
        line-height: 1.2em;
        font-size: 14px;
        color: black;
        text-transform: capitalize;
    }
    #nine-dot-dropdown::part(panel) {
      width: 250px !important;
    }
    #nine-dot-dropdown sl-menu {
      width: 250px !important;
    }
    div.software-details {
        border-top: 1px solid var(--sl-color-gray-300);
        display: flex;
        flex-direction: column;
        font-size: 10pt;
        gap: 4px;
        padding-top: 16px;
    }
    div.software-details > p {
        margin: 0;
    }
    #logo {
        height: 36px;
        margin-right: 16px;
        pointer-events: none;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
    }
    * {
        font-family: Roboto !important;
    }
    sl-avatar.toolbar-icon {
        --size: 30px;
    }
  `];

  // Render the component's DOM by returning a Lit template
  render() {
    return html`
      <div flex row id="toolbar">
        <!-- Left Container -->
        <div flex row align-center grow justify-start>
          <slot name="left-of-logo"></slot>
          ${when(this.logoLink, () => html`<img id="logo" src="${this.logoLink}" />`)}
          <slot name="left"></slot>
        </div>
        <!-- Center Container -->
        <div flex row align-center grow justify-center>
          <slot name="center"></slot>
        </div>
        <!-- Right Container -->
        <div flex row align-center grow justify-end>
          <slot name="right"></slot>
          <div flex row align-center>
            <sl-dropdown id="help-dropdown" placement="bottom-end">
                <sl-icon-button circle slot="trigger" class="toolbar-icon" pointer library="material" name="help_round"></sl-icon-button>
                ${when(
                    this.supportNum || this.supportEmail, 
                    () => html`
                    <p style="margin-top: 0;">
                        If you have questions or need support, please
                        ${when(this.supportNum, () => html`call us at ${this.supportNum}`)}
                        ${when(this.supportNum && this.supportEmail, () => html` or `)}
                        ${when(this.supportEmail,
                            () => html`email us at <a style="color: var(--primary-color, blue); text-decoration: none;" href="mailto:${this.supportEmail}">${this.supportEmail}</a
                        >`)}.
                    </p>
                `)}
                ${when(!(this.supportNum || this.supportEmail), () => html`<p style="margin-top: 0;">A Katapult Pro Extension</p>`)}
              <div class="software-details">
                <p>
                  This webpage is hosted
                  ${when(
                    this.companyName,
                    () => html`by ${this.companyName}`
                  )}
                  using Katapult Engineering's API, and extends the Katapult Pro software.
                </p>
                <p>Katapult does not manage or hold responsibility for this domain.</p>
              </div>
            </sl-dropdown>
            <sl-dropdown id="nine-dot-dropdown" placement="bottom-end">
              <sl-icon-button class="toolbar-icon" pointer library="material" name="apps" slot="trigger"></sl-icon-button>
              <sl-menu>
                ${when(
                  this._pages.length > 0,
                  () => html`
                    <div flex row align-center justify-center style="flex-wrap: wrap; padding: 8px 5px 0 5px;">
                      ${map(
                          this._pages,
                          (page) => 
                          html`
                              <sl-menu-item flex column @click=${(e) => this.#openPage(e)}>
                                  <sl-icon
                                  nine-dot
                                  flex
                                  row
                                  justify-center
                                  wrap
                                  slot="prefix"
                                  library="material"
                                  name="${page.icon}"
                                  style="color: ${page.color};"
                                  ></sl-icon>
                                  ${page.displayName}
                              </sl-menu-item>
                        `)}
                    </div>
                `)}
                ${when(
                  this._pages.length === 0,
                  () => html`
                    <div flex row align-center justify-start style="border: 3px solid var(--primary-color, var(--sl-color-gray-500)); border-radius: 15px; margin: 0 8px;">
                      <sl-spinner style="font-size: 40px; --track-width: 4px; --indicator-color: var(--primary-color, var(--sl-color-gray-400)); --track-color: var(--sl-color-gray-200); margin: 8px; margin-left: 12px;"></sl-spinner>
                      <div style="font-size: 18px; color: var(--sl-color-gray-400); margin-left: 32px;">Loading...</div>
                    </div>
                `)}
              </sl-menu>
            </sl-dropdown>
            <sl-dropdown placement="bottom-end">
              <sl-avatar class="toolbar-icon" pointer image="${this._gravatarSrc}" slot="trigger"></sl-avatar>
              <sl-menu flex column justify-center align-center style="padding: 16px;">
                <div flex row justify-center align-center>
                  <sl-avatar pointer image="${this._gravatarSrc}"></sl-avatar>
                  ${when(this._email, () => html`<span style="margin-left: 12px;">${this._email}</span>`)}
                </div>
                <sl-button variant="default" style="margin-top: 12px;" @click=${() => this.#signOut()}>
                  <sl-icon slot="prefix" library="material" name="logout"></sl-icon>
                  Sign Out
                </sl-button>
              </sl-menu>
            </sl-dropdown>
          </div>
        </div>
      </div>
      `;
  }
  constructor() {
    super();

    // Delete api data from local storage if expired
    const now = new Date();
    const apiLocal = localStorage.getItem('apiKey') ? JSON.parse(localStorage.getItem('apiKey')) : '';
    if(now >= apiLocal?.expiry) localStorage.removeItem('apiKey');
    const dbLocal = localStorage.getItem('db') ? JSON.parse(localStorage.getItem('db')) : '';
    if(now >= dbLocal?.expiry) localStorage.removeItem('db');

    // Variables
    this.logoLink = '';
    this.companyName = '';
    this.supportNum = '';
    this.supportEmail = '';
    this._pages = [];
    this._email = '';
    this._gravatarSrc = this.#getGravatarSrc(this._email);
    this._apiKey = apiLocal?.data ? xorDecrypt(apiLocal.data) : '';
    this._currentDb = dbLocal?.data || '';
    if (this._apiKey) this.#getPages();

    // Functions and Events
    window.addEventListener('apiChange', async (e) => {
      this._apiKey = xorDecrypt(e.detail?.key);
      this._currentDb = e.detail?.db;
      if (this._apiKey) await this.#getPages();
      else this.requestUpdate();
    });
  }
  #signOut() {
    localStorage.removeItem('apiKey');
    localStorage.removeItem('db');
    window.dispatchEvent(new CustomEvent('apiChange', { detail: null }));
  }
  #getGravatarSrc(email) {
    if (!email) return '';
    let hashedEmail = SparkMD5.hash(email);
    return `https://www.gravatar.com/avatar/${hashedEmail}?s=100&d=blank`;
  }
  #openPage(e) {
    const title = e.currentTarget.innerText.toLowerCase();
    const clickedPage = this._pages.filter(page => page.name == title)[0];
    const urlToVisit = 'https://' + this._currentDb + '.katapultpro.com/' + clickedPage.url;
    window.open(urlToVisit, '_blank');
  }
  async #getPages() {
    const database = this._currentDb != '' ? this._currentDb + '.' : '';
    setTimeout( async () => {
      if(this._apiKey) {
        const fetchData = await fetch(`https://${database}katapultpro.com/api/v2/company-data/pages?api_key=${this._apiKey}`, {
          method: 'GET',
        }).then((res) => res.json());
        if(!fetchData.error) {
          fetchData.forEach(page => {
            page.displayName = page.name.length > 20 ? page.name.slice(0, 15) + '...' : page.name;
            page.icon = page.icon +'_round';

            // Update the coloring for project management, since the API stores it as "primary color." Set it to the right color
            if(page.color === 'var(--primary-color)') page.color = '#003e51';
          });
          this._pages = fetchData;
          this.requestUpdate();
        }
      }
    }, 2500);
  }
}
window.customElements.define('katapult-toolbar', KatapultToolbar);