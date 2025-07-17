// Lit
import { LitElement, html } from 'lit';
import { when } from 'lit/directives/when.js';

// Elements
import './katapult-dropdown.js';

// Other
import { xorDecrypt } from './page-element/dependencies/obfuscation.js';

export class KatapultJobDropdown extends LitElement {
  static properties = {
    _jobData: {type: Array, state: true},
    _jobNames: {type: Array, state: true},
    _apiKey: {type: String},
    _currentJobData: {type: Object}
  }
  render() {
    return html`
      ${when(
        !this._jobNames || this._jobNames.length == 0,
        () => html`
          <katapult-dropdown
            .disabled=${true}
            .placeholder=${'Loading...'}
            .lookLikePaperElement=${true}
          ></katapult-dropdown>
        `
      )}
      ${when(
        this._jobNames?.length > 0,
        () => html`
          <katapult-dropdown
            id="active-dropdown"
            .hoist=${true}
            .clearable=${true}
            .autoFilter=${true}
            .items=${this._jobNames}
            .lookLikePaperElement=${true}
            .placeholder=${'Select a Job'}
            @change=${(e) => this.#selectJob(e)}
          ></katapult-dropdown>
        `
      )}
    `
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
    this._jobData = [];
    this._jobNames = [];
    this._apiKey = apiLocal?.data ? xorDecrypt(apiLocal.data) : '';
    this._currentJobData = {};

    // Events and Functions
    window.addEventListener('apiChange', async (e) => {
      this._apiKey = xorDecrypt(e.detail?.key);
      if (this._apiKey) await this.#getJobData(e.detail.db);
      else if (e.detail == null) {
        this.shadowRoot.getElementById('active-dropdown').setAttribute('value', '');
        this._currentJobData = {};
        this.dispatchEvent(new CustomEvent('change'));
      }
    });
    if (this._apiKey) this.#getJobData(dbLocal?.data);
  }
  getSelectedJob() {
    return this._currentJobData || {};
  }
  #selectJob(e) {
    const selectedJobData = this._jobData.filter(job => job.name === e.currentTarget.value)[0] || {};
    this._currentJobData = selectedJobData;
    this.dispatchEvent(new CustomEvent('change'));
  }
  async #getJobData(db) {
    setTimeout( async () => {
      const fetchData = await fetch(`${db}/api/v3/jobs?api_key=${this._apiKey}`, {
        method: 'GET'
      }).then((res) => res.json());
      this._jobData = fetchData.data;
      if(this._jobData) this._jobNames = this._jobData.map(job => ({value: job.name, label: job.name}));
      this.requestUpdate();
    }, 200);
  }
}
window.customElements.define('katapult-job-dropdown', KatapultJobDropdown);
