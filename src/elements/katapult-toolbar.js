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

// Styles
import { SlKatapultStyle } from '../styles/sl-katapult-style';
import { FlexStyle } from '../styles/flex';

// Hashing
import 'spark-md5';

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
        _refreshAPICheck: {type: Boolean, state: true},
        _apiKey: {type: String, state: true, reflect: true},
        _currentDb: {type: String, state: true, reflect: true}
    }

  // Styles are applied to the shadow root and scoped to this element
  static styles = [
    unsafeCSS(SlKatapultStyle),
    unsafeCSS(FlexStyle),
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
    #nine-dot-dropdown sl-menu {
        width: 250px;
        padding: 16px 5px 0 5px;
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
  `];

  // Render the component's DOM by returning a Lit template
  render() {
    return html`
      <div flex row id="toolbar">
        <!-- Left Container -->
        <div flex row align-center grow justify-start>
          <slot name="leftOfLogo"></slot>
          ${when(this.logoLink, () => html`<img id="logo" src="${this.logoLink}" />`)}
          <slot name="rightOfLogo"></slot>
        </div>
        <!-- Center Container -->
        <div flex row align-center grow justify-center>
          <slot name="center"></slot>
        </div>
        <!-- Right Container -->
        <div flex row align-center grow justify-end>
          <slot name="right"></slot>
          <div flex row align-center>
            <!-- FOR THIS DROPDOWN, WE NEED TO FIX THE ANIMATION ON DROPDOWN.HIDE FROM RESIZING WEIRD DUE TO WIDTH STYLING -->
            <sl-dropdown id="help-dropdown">
                <sl-icon-button circle slot="trigger" class="toolbar-icon" pointer library="material" name="help_round"></sl-icon-button>
                ${when(
                    this.supportNum || this.supportEmail, 
                    () => html`
                    <p style="margin-top: 0;">
                        If you have questions or need support, please
                        ${when(this.supportNum, () => html`call us at ${this.supportNum}`)}
                        ${when(this.supportNum && this.supportEmail, () => html` or `)}
                        ${when(this.supportEmail,
                            () => html`email us at <a style="color: var(--primary-color, var(--sl-color-gray-500)); text-decoration: none;" href="mailto:${this.supportEmail}">${this.supportEmail}</a
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
            <sl-dropdown id="nine-dot-dropdown">
              <sl-icon-button class="toolbar-icon" pointer library="material" name="apps" slot="trigger"></sl-icon-button>
              <sl-menu flex row align-center justify-center style="flex-wrap: wrap;">
                ${map(
                    this.pages,
                    (page) => 
                    html`
                        <sl-menu-item flex column @click=${(e) => this.openPage(e)}>
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
                    `
                )}
              </sl-menu>
            </sl-dropdown>
            <sl-avatar class="toolbar-icon" pointer image="${this.gravatarSrc}"></sl-avatar>
            <sl-dropdown open></sl-dropdown>
          </div>
        </div>
      </div>
      `;
  }
  constructor() {
    super();

    // Variables
    this.logoLink = '';
    this.companyName = '';
    this.supportNum = '';
    this.supportEmail = '';
    this.pages = [];
    this.email = '';
    this.gravatarSrc = this.getGravatarSrc(this.email);
    this.refreshAPICheck = false;
    this.apiKey = this.getAPI(this.refreshAPICheck);
    this.currentDb = 'dcs';

    // Functions and Events
    window.addEventListener('apiKeyChange', async () => {
      this.refreshAPICheck = !this.refreshAPICheck;
    });
    if (this.apiKey) this.getPages();
  }
  getGravatarSrc(email) {
    if (!email) return '';
    let hashedEmail = SparkMD5.hash(email);
    return `https://www.gravatar.com/avatar/${hashedEmail}?s=100&d=blank`;
  }
  getAPI(refreshAPICheck) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('api_key') || localStorage.getItem('apiKey') || '';
  }
  openPage(e) {
    const title = e.currentTarget.innerText.toLowerCase();
    const clickedPage = this.pages.filter(page => page.name == title)[0];
    const urlToVisit = 'https://' + this.currentDb + '.katapultpro.com/' + clickedPage.url;
    window.open(urlToVisit, '_blank');
  }
  async getPages() {
    const database = this.currentDb != 'database' ? this.currentDb + '.' : '';
    const fetchData = await fetch(`https://${database}katapultpro.com/api/v2/company-data/pages?api_key=${this.apiKey}`, {
      method: 'GET',
    }).then((res) => res.json());
    if(!fetchData.error) {
      fetchData.forEach(page => {
        page.displayName = page.name.length > 20 ? page.name.slice(0, 15) + '...' : page.name;
        page.icon = page.icon +'_round';
      });
      this.pages = fetchData;
      this.requestUpdate();
    }
  }
}
window.customElements.define('katapult-toolbar', KatapultToolbar);