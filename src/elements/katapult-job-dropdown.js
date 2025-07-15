// Lit
import { LitElement, html } from 'lit';
import { when } from 'lit/directives/when.js';

// Elements
import './katapult-dropdown.js';

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
            .noLabel=${true}
            .noHelpText=${true}
          ></katapult-dropdown>
        `
      )}
      ${when(
        this._jobNames?.length > 0,
        () => html`
          <katapult-dropdown
            .hoist=${true}
            .clearable=${true}
            .autoFilter=${true}
            .items=${this._jobNames}
            .lookLikePaperElement=${true}
            .placeholder=${'Select a Job'}
            .noLabel=${true}
            .noHelpText=${true}
            @change=${(e) => this.#selectJob(e)}
          ></katapult-dropdown>
        `
      )}
    `
  }
  constructor() {
    super();

    // Variables
    this._jobData = [];
    this._jobNames = [];
    this._apiKey = localStorage.getItem('apiKey') || '';
    this._currentJobData = {};

    // Events and Functions
    window.addEventListener('apiChange', async (e) => {
      this._apiKey = e.detail?.key;
      if (this._apiKey) await this.#getJobData(e.detail.db);
      else this.requestUpdate();
    });
    if (this._apiKey) this.#getJobData(localStorage.getItem('db'));
  }
  getSelectedJob() {
    return this._currentJobData;
  }
  #selectJob(e) {
    const selectedJobData = this._jobData.filter(job => job.name === e.currentTarget.value)[0];
    this._currentJobData = selectedJobData;
    this.dispatchEvent(new CustomEvent('change'));
  }
  async #getJobData(db) {
    const database = db != '' ? db + '.' : '';
    setTimeout( async () => {
      const fetchData = await fetch(`https://${database}katapultpro.com/api/v3/jobs?api_key=${this._apiKey}`, {
        method: 'GET'
      }).then((res) => res.json());
      this._jobData = fetchData.data;
      if(this._jobData) this._jobNames = this._jobData.map(job => ({value: job.name, label: job.name}));
      this.requestUpdate();
    }, 200);
  }
}
window.customElements.define('katapult-job-dropdown', KatapultJobDropdown);
